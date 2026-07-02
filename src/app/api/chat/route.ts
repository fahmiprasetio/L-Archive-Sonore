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

// --- Konfigurasi LLM (OpenAI-compatible; default Groq gratis) ---
const AI_API_KEY = process.env.AI_CHAT_API_KEY;
const AI_BASE_URL = (process.env.AI_CHAT_BASE_URL || 'https://api.groq.com/openai/v1').replace(/\/+$/, '');
const AI_MODEL = process.env.AI_CHAT_MODEL || 'llama-3.3-70b-versatile';

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

// Panggil LLM lewat endpoint OpenAI-compatible (Groq/OpenRouter/Gemini-compat).
async function askLLM(messages: ChatMessage[], catalogText: string): Promise<string> {
  const system = [
    "Kamu adalah \"Sonora\", asisten belanja ramah untuk toko alat musik online L'Archive Sonore.",
    'Tugasmu membantu pelanggan memilih alat musik (gitar, piano, drum, synth, biola, bass, dll) sesuai kebutuhan & budget.',
    'Jawab SELALU dalam Bahasa Indonesia yang natural, ringkas, dan membantu.',
    'Rekomendasikan HANYA produk yang ada di katalog di bawah. Sebutkan nama & harga produk saat merekomendasikan.',
    'Jika permintaan pengguna tidak cocok dengan katalog, katakan dengan jujur dan tawarkan alternatif terdekat dari katalog.',
    'Jangan mengarang produk, harga, stok, atau janji yang tidak ada di katalog. Jangan bahas topik di luar toko.',
    '',
    'KATALOG PRODUK (sumber otoritatif):',
    catalogText,
  ].join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.4,
        max_tokens: 600,
        messages: [{ role: 'system', content: system }, ...messages],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`AI provider ${res.status}: ${detail.slice(0, 300)}`);
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Respons AI kosong');
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  // Rate limit: 20 permintaan / menit / IP.
  const ip = getClientIp(request);
  const rl = await rateLimit(`chat:${ip}`, 20, 60_000);
  if (!rl.allowed) return tooManyRequestsResponse(rl.resetAt);

  // Baca body dengan batas ukuran.
  const parsed = await readJsonLimited<{ messages?: unknown }>(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const messages = sanitizeMessages(parsed.value?.messages);
  if (!messages) {
    return NextResponse.json({ error: 'Pesan tidak valid.' }, { status: 400 });
  }

  const catalog = await loadCatalog();

  // Coba LLM bila dikonfigurasi; bila gagal, jatuh ke fallback lokal.
  if (AI_API_KEY) {
    try {
      const reply = await askLLM(messages, buildCatalogText(catalog));
      return NextResponse.json({ reply });
    } catch (e) {
      console.error('AI chat error, memakai fallback lokal:', e);
    }
  }

  return NextResponse.json({ reply: localFallback(messages, catalog) });
}
