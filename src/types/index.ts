export type Currency = 'USD' | 'EUR' | 'GBP' | 'TRY';
export type Theme = 'light' | 'dark' | 'system';

export interface Multiplier {
  id: string;
  label: string;
  value: number; // percentage, e.g., 18 for +18%, -18 for -18%
}

export interface Settings {
  targetCurrency: Exclude<Currency, 'USD'>;
  autoReset: boolean;
  firstVisit: boolean;
  isReversed: boolean;
  multipliers: Multiplier[];
  quickValues: number[];
  theme: Theme;
}

export interface HistoryEntry {
  id: string;
  inputValue: number;
  outputValue: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  modifier: { label: string; value: number } | null;
  timestamp: number;
}

export interface RateCache {
  rates: Record<Currency, number>;
  timestamp: number;
}

export interface ExchangeRateResponse {
  rates: Record<Currency, number>;
  timestamp: number;
}

export const DEFAULT_SETTINGS: Settings = {
  targetCurrency: 'TRY',
  autoReset: false,
  firstVisit: true,
  isReversed: false,
  multipliers: [
    { id: '1', label: '+KDV', value: 18 },
    { id: '2', label: '-KDV', value: -18 },
    { id: '3', label: '+OTV25', value: 25 },
  ],
  quickValues: [50, 100, 500, 1000],
  theme: 'system',
};

export const CURRENCIES: { code: Currency; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
];

export const STORAGE_KEYS = {
  settings: 'trcalc-settings',
  history: 'trcalc-history',
  rates: 'trcalc-rates',
} as const;
