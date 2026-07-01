import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PRODUCTS } from '@/lib/products';
import { rateLimit, getClientIp, tooManyRequestsResponse } from '@/lib/rate-limit';
import { readJsonLimited } from '@/lib/body-limit';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_MESSAGES = 12;
const MAX_CONTENT = 1500;

// Bersihkan & batasi riwayat pesan dari klien (mitigasi abuse & prompt bloat).
function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const out: ChatMessage[] = [];
  for (const m of input.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') continue;
    const role = (m as Record<string, unknown>).role;
    const content = (m as Record<string, unknown>).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') continue;
    const trimmed = content.trim().slice(0, MAX_CONTENT);
    if (trimmed) out.push({ role, content: trimmed });
  }
  return out.length > 0 ? out : null;
}

interface CatalogRow {
  name: string;
  category: string;
  price: number;
  description: string;
  stock?: number;
}

// Katalog dari DB (otoritatif) bila tersedia, fallback ke katalog statis.
async function loadCatalog(): Promise<CatalogRow[]> {
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin
        .from('products')
        .select('name, category, price, description, stock')
        .limit(60);
      if (data && data.length) return data as CatalogRow[];
    } catch {
      // fallback di bawah
    }
  }
  return PRODUCTS.map((p) => ({
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
  }));
}

function buildCatalogText(rows: CatalogRow[]): string {
  return rows
    .map(
      (r) =>
        `- ${r.name} | ${r.category} | $${r.price}${
          typeof r.stock === 'number' ? ` | stok:${r.stock}` : ''
        } | ${r.description}`
    )
    .join('\n');
}

// Fallback tanpa LLM: pencarian kata kunci sederhana atas katalog.
function localFallback(messages: ChatMessage[], rows: CatalogRow[]): string {
  const last =
    [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';
  const terms = last.split(/[^a-z0-9]+/i).filter((t) => t.length >= 3);
  const scored = rows
    .map((r) => {
      const hay = `${r.name} ${r.category} ${r.description}`.toLowerCase();
      const score = terms.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (scored.length === 0) {
    return "Halo! Saya asisten L'Archive Sonore. Saya bisa bantu merekomendasikan alat musik (gitar, piano, drum, synth, biola, bass). Coba sebutkan kebutuhan atau budget Anda.";
  }
  const list = scored
    .map(({ r }) => `\u2022 ${r.name} (${r.category}) \u2014 $${r.price.toLocaleString('en-US')}`)
    .join('\n');
  return `Berikut beberapa rekomendasi dari katalog kami:\n${list}\n\nMau saya bandingkan atau carikan yang lain?`;
}

export async function POST(request: Request) {
  // Rate limit: 20 pesan per menit per IP.
  const ip = getClientIp(request);
  const rl = await rateLimit(`chat:${ip}`, 20, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  const bodyResult = await readJsonLimited<{ messages?: unknown }>(request);
  if (!bodyResult.ok) {
    return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status });
  }

  const messages = sanitizeMessages(bodyResult.value?.messages);
  if (!messages) {
    return NextResponse.json({ error: 'Pesan tidak valid' }, { status: 400 });
  }

  const rows = await loadCatalog();

  const apiKey = process.env.AI_CHAT_API_KEY || '';
  const baseUrl = process.env.AI_CHAT_BASE_URL || 'https://api.groq.com/openai/v1';
  const model = process.env.AI_CHAT_MODEL || 'llama-3.3-70b-versatile';

  // Tanpa API key (belum diisi di Vercel), pakai fallback lokal agar fitur tetap hidup.
  if (!apiKey) {
    return NextResponse.json({ reply: localFallback(messages, rows), degraded: true });
  }

  const systemPrompt = [
    "Anda adalah asisten belanja ramah untuk L'Archive Sonore, toko alat musik premium.",
    'Jawab singkat, hangat, dan membantu. Gunakan bahasa yang sama dengan pengguna (Indonesia atau Inggris).',
    'Hanya rekomendasikan produk dari KATALOG di bawah. Jangan mengarang produk, harga, atau stok.',
    'Jika ditanya di luar konteks toko, arahkan kembali dengan sopan ke pemilihan alat musik.',
    'Harga dalam USD ($).',
    '',
    'KATALOG:',
    buildCatalogText(rows),
  ].join('\n');

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 600,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('AI chat upstream error:', res.status, errText.slice(0, 300));
      return NextResponse.json({ reply: localFallback(messages, rows), degraded: true });
    }

    const data = await res.json();
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ reply: localFallback(messages, rows), degraded: true });
    }
    return NextResponse.json({ reply });
  } catch (e) {
    console.error('AI chat error:', e);
    return NextResponse.json({ reply: localFallback(messages, rows), degraded: true });
  }
}
