import { useState } from 'react';
import { Delete, Lock, X } from 'lucide-react';

interface PinModalProps {
  expectedPin: string;
  defaultDemoPin?: string;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function PinModal({
  expectedPin,
  defaultDemoPin = '1234',
  title = 'Accès Espace Parent',
  subtitle = 'Saisis le code PIN à 4 chiffres pour ouvrir la gestion.',
  onSuccess,
  onClose,
}: PinModalProps) {
  const [digits, setDigits] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (d: string) => {
    if (digits.length >= 4) return;
    const next = digits + d;
    setDigits(next);
    setError(false);

    if (next.length === 4) {
      if (next === expectedPin) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setDigits('');
        }, 420);
      }
    }
  };

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="animate-pop-in w-full max-w-xs rounded-3xl border border-[#E8DDD0] bg-[#FAF6F0] p-6 text-[#1F2421] shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E4D3B] text-white">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="parent-display text-lg font-bold leading-tight">{title}</h2>
              <p className="text-xs text-[#5C6660]">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#5C6660] hover:bg-black/5"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PIN dots */}
        <div className="my-5 flex justify-center gap-3.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-4 w-4 rounded-full border-2 transition-all ${
                error
                  ? 'border-red-500 bg-red-500 scale-110'
                  : idx < digits.length
                    ? 'border-[#C85A32] bg-[#C85A32] scale-110'
                    : 'border-[#C9BCAD] bg-white'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="mb-3 text-center text-xs font-semibold text-red-600">
            Code incorrect, réessaie.
          </p>
        )}

        {expectedPin === defaultDemoPin && (
          <p className="mb-3 rounded-xl bg-[#FEF7E6] px-3 py-1.5 text-center text-xs text-[#92620A]">
            Code démo par défaut : <strong>{defaultDemoPin}</strong> (modifiable dans Réglages)
          </p>
        )}

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleDigit(n)}
              className="h-13 rounded-2xl border border-[#E8DDD0] bg-white text-lg font-bold text-[#1F2421] shadow-xs transition hover:bg-[#F4EDE3] active:scale-95"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-13 rounded-2xl border border-[#E8DDD0] bg-white text-lg font-bold text-[#1F2421] shadow-xs transition hover:bg-[#F4EDE3] active:scale-95"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="flex h-13 items-center justify-center rounded-2xl border border-[#E8DDD0] bg-[#F4EDE3] text-[#5C6660] transition hover:bg-[#EAE0D3] active:scale-95"
            aria-label="Effacer"
          >
            <Delete className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
