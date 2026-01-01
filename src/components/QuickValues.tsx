interface QuickValuesProps {
  values: number[];
  onSelect: (value: number) => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}m` : `${millions.toFixed(1)}m`;
  }
  if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }
  return num.toString();
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(1);
  }
}

export function QuickValues({ values, onSelect }: QuickValuesProps) {
  if (values.length === 0) return null;

  const handleClick = (value: number) => {
    haptic();
    onSelect(value);
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide -mx-2 px-2">
      <div className="flex gap-2 w-max">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => handleClick(value)}
            className="px-3 py-1.5 bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-900/60
                       text-purple-700 dark:text-purple-300 rounded-md font-medium
                       active:bg-gradient-to-t active:from-purple-200 active:to-purple-300
                       dark:active:from-purple-900/60 dark:active:to-purple-900/80
                       active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                       transition-all duration-75 text-sm whitespace-nowrap flex-shrink-0"
          >
            {formatNumber(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
