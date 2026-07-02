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
  return NextResponse.json({
    reply: "Halo! Saya asisten L'Archive Sonore. Saya bisa bantu merekomendasikan alat musik (gitar, piano, drum, synth, biola, bass). Coba sebutkan kebutuhan atau budget Anda."
  });
}
