"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Halo! Saya asisten L'Archive Sonore. Saya bisa bantu merekomendasikan alat musik (gitar, piano, drum, synth, biola, bass). Coba sebutkan kebutuhan atau budget Anda.",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply: string = data?.reply || 'Maaf, terjadi kendala. Coba lagi.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Maaf, koneksi bermasalah. Coba lagi sebentar.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Tutup asisten' : 'Buka asisten belanja'}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-[#441004] text-[#F0F0F0] shadow-lg transition hover:bg-[#300a02]"
      >
        {open ? <X className="h-[18px] w-[18px]" /> : <MessageCircle className="h-[18px] w-[18px]" />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[30rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-[#441004]/20 bg-[#F0F0F0] shadow-2xl">
          <div className="flex items-center gap-2 bg-[#441004] px-4 py-3 text-[#F0F0F0]">
            <Bot className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold leading-tight">Sonora</p>
              <p className="text-[11px] text-[#F0F0F0]/75">L&apos;Archive Sonore</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-[#441004] text-[#F0F0F0]'
                      : 'rounded-bl-sm border border-[#441004]/15 bg-white text-[#292B29]'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-[#441004]/15 bg-white px-3 py-2 text-sm text-[#292B29]/60">
                  Mengetik…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-[#441004]/15 p-2">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Tanya apa saja soal produk…"
                className="flex-1 resize-none rounded-lg border border-[#292B29]/20 bg-white px-3 py-2 text-sm text-[#292B29] focus:border-[#441004] focus:outline-none"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="Kirim"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#441004] text-[#F0F0F0] transition hover:bg-[#300a02] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 px-1 text-[10px] text-[#292B29]/50">
              AI bisa keliru. Verifikasi detail penting.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
