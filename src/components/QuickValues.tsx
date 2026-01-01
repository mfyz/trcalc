interface QuickValuesProps {
  values: number[];
  onSelect: (value: number) => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
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
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => handleClick(value)}
            className="px-3 py-1.5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700
                       text-gray-700 dark:text-gray-200 rounded-md font-medium
                       active:bg-gradient-to-t active:from-gray-100 active:to-gray-200
                       dark:active:from-gray-700 dark:active:to-gray-800
                       active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
                       transition-all duration-75 text-sm"
          >
            {formatNumber(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
