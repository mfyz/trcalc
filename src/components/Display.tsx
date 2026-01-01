import { Currency, CURRENCIES } from '@/types';

interface DisplayProps {
  value: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  onSwap: () => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
}

function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol || currency;
}

function getCurrencyColor(currency: Currency): { bg: string; text: string; valueText: string } {
  if (currency === 'USD') {
    return {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      valueText: 'text-blue-800 dark:text-blue-300'
    };
  }
  return {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    valueText: 'text-amber-800 dark:text-amber-300'
  };
}

export function Display({ value, fromCurrency, toCurrency, rate, onSwap }: DisplayProps) {
  const fromSymbol = getCurrencySymbol(fromCurrency);
  const toSymbol = getCurrencySymbol(toCurrency);
  const fromColors = getCurrencyColor(fromCurrency);
  const toColors = getCurrencyColor(toCurrency);

  // Calculate conversion
  const outputValue = Math.round(value * rate);

  return (
    <div className="w-full flex gap-2">
      {/* Swap button on left */}
      <button
        onClick={onSwap}
        className="flex items-center justify-center px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 rounded-lg transition-colors"
        title="Swap currencies"
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </button>

      {/* Currency rows */}
      <div className="flex-1 space-y-2">
        {/* Input row */}
        <div className={`flex items-center justify-between ${fromColors.bg} rounded-lg px-4 py-3`}>
          <span className={`text-sm font-medium ${fromColors.text}`}>{fromCurrency}</span>
          <span className={`text-3xl font-bold ${fromColors.valueText}`}>
            {fromSymbol}{formatNumber(value) || '0'}
          </span>
        </div>

        {/* Output row */}
        <div className={`flex items-center justify-between ${toColors.bg} rounded-lg px-4 py-3`}>
          <span className={`text-sm font-medium ${toColors.text}`}>{toCurrency}</span>
          <span className={`text-3xl font-bold ${toColors.valueText}`}>
            {toSymbol}{formatNumber(outputValue)}
          </span>
        </div>
      </div>
    </div>
  );
}
