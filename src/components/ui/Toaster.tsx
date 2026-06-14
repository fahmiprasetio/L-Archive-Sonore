'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/toastStore';

const CONFIG: Record<
  Toast['type'],
  { icon: typeof CheckCircle2; accent: string; iconColor: string }
> = {
  success: { icon: CheckCircle2, accent: 'border-l-emerald-500', iconColor: 'text-emerald-500' },
  error: { icon: XCircle, accent: 'border-l-red-500', iconColor: 'text-red-500' },
  info: { icon: Info, accent: 'border-l-sage-primary', iconColor: 'text-sage-primary' },
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const { icon: Icon, accent, iconColor } = CONFIG[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-lg border border-neutral-200 border-l-4 ${accent} bg-white px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300`}
      role="status"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <p className="flex-1 text-sm text-neutral-800 leading-snug">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 text-neutral-400 transition hover:text-neutral-700 cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[calc(100%-3rem)] max-w-sm flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
