import { Multiplier } from '@/types';

interface MultiplierButtonsProps {
  multipliers: Multiplier[];
  onMultiplier: (multiplier: Multiplier) => void;
}

export function MultiplierButtons({ multipliers, onMultiplier }: MultiplierButtonsProps) {
  if (multipliers.length === 0) return null;

  return (
    <div className="w-full">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Multipliers</div>
      <div className="flex flex-wrap gap-2">
        {multipliers.map((multiplier) => (
          <button
            key={multiplier.id}
            onClick={() => onMultiplier(multiplier)}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg font-medium
                       hover:bg-purple-200 dark:hover:bg-purple-900/60 active:bg-purple-300 dark:active:bg-purple-900/80 transition-colors
                       min-w-[80px] text-sm"
          >
            {multiplier.label}
          </button>
        ))}
      </div>
    </div>
  );
}
