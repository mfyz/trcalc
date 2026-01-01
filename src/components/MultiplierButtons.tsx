import { Multiplier } from '@/types';

interface MultiplierButtonsProps {
  multipliers: Multiplier[];
  onMultiplier: (multiplier: Multiplier) => void;
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(1);
  }
}

export function MultiplierButtons({ multipliers, onMultiplier }: MultiplierButtonsProps) {
  if (multipliers.length === 0) return null;

  const handleClick = (multiplier: Multiplier) => {
    haptic();
    onMultiplier(multiplier);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {multipliers.map((multiplier) => (
          <button
            key={multiplier.id}
            onClick={() => handleClick(multiplier)}
            className="px-4 py-2 bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/60
                       text-purple-700 dark:text-purple-300 rounded-lg font-medium
                       active:bg-gradient-to-t active:from-purple-200 active:to-purple-300
                       dark:active:from-purple-900/60 dark:active:to-purple-900/80
                       active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                       transition-all duration-75 min-w-[80px] text-sm"
          >
            {multiplier.label}
          </button>
        ))}
      </div>
    </div>
  );
}
