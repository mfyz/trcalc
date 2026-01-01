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
            className="px-2 py-1 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700
                       text-gray-700 dark:text-gray-200 rounded-md font-medium
                       active:bg-gradient-to-t active:from-gray-300 active:to-gray-400
                       dark:active:from-gray-700 dark:active:to-gray-800
                       active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                       transition-all duration-75 text-xs"
          >
            {multiplier.label}
          </button>
        ))}
      </div>
    </div>
  );
}
