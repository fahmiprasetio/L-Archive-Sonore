import { Check, Clock, CreditCard, Package, Truck, Home, XCircle } from 'lucide-react';

// Alur fulfillment happy-path. cancelled/failed ditangani terpisah.
const FLOW = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'paid', label: 'Paid', icon: CreditCard },
  { key: 'processing', label: 'Diproses', icon: Package },
  { key: 'shipped', label: 'Dikirim', icon: Truck },
  { key: 'delivered', label: 'Sampai', icon: Home },
] as const;

interface Props {
  status: string;
}

export default function OrderTracker({ status }: Props) {
  const s = (status || '').toLowerCase();

  if (s === 'cancelled' || s === 'failed') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
        <XCircle className="h-4 w-4 flex-shrink-0" />
        {s === 'cancelled' ? 'Pesanan dibatalkan' : 'Pembayaran gagal'}
      </div>
    );
  }

  const currentIndex = Math.max(
    0,
    FLOW.findIndex((f) => f.key === s)
  );

  return (
    <div className="flex items-start">
      {FLOW.map((step, idx) => {
        const Icon = step.icon;
        const done = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-14 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                  done
                    ? 'border-sage-primary bg-sage-primary text-white'
                    : 'border-neutral-200 bg-white text-neutral-300'
                } ${isCurrent ? 'ring-2 ring-sage-primary/30' : ''}`}
              >
                {done && !isCurrent ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={`mt-1 text-center text-[10px] font-medium leading-tight ${
                  done ? 'text-neutral-700' : 'text-neutral-300'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < FLOW.length - 1 && (
              <div
                className={`mt-4 h-0.5 flex-1 rounded-full ${
                  idx < currentIndex ? 'bg-sage-primary' : 'bg-neutral-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
