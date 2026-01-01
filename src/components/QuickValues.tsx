interface QuickValuesProps {
  values: number[];
  onSelect: (value: number) => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
}

export function QuickValues({ values, onSelect }: QuickValuesProps) {
  if (values.length === 0) return null;

  return (
    <div className="w-full">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Values</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md font-medium
                       hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 transition-colors
                       text-sm"
          >
            {formatNumber(value)}
          </button>
        ))}
      </div>
    </div>
  );
}
