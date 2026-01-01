import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { RateCache, Currency, STORAGE_KEYS } from '@/types';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

const DEFAULT_RATES: RateCache = {
  rates: { USD: 1, EUR: 0.92, GBP: 0.79, TRY: 34.5 },
  timestamp: 0,
};

export function useExchangeRate() {
  const [rateCache, setRateCache, isLoaded] = useLocalStorage<RateCache>(
    STORAGE_KEYS.rates,
    DEFAULT_RATES
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCacheValid = useCallback(() => {
    if (!rateCache.timestamp) return false;
    return Date.now() - rateCache.timestamp < CACHE_TTL;
  }, [rateCache.timestamp]);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/exchange-rate');
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      const data = await response.json();
      const newCache: RateCache = {
        rates: data.rates,
        timestamp: Date.now(),
      };
      setRateCache(newCache);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [setRateCache]);

  useEffect(() => {
    if (isLoaded && !isCacheValid()) {
      fetchRates();
    }
  }, [isLoaded, isCacheValid, fetchRates]);

  const getRate = useCallback(
    (currency: Currency): number => {
      return rateCache.rates[currency] || 1;
    },
    [rateCache.rates]
  );

  const convert = useCallback(
    (amount: number, from: Currency, to: Currency): number => {
      const fromRate = getRate(from);
      const toRate = getRate(to);
      // Convert to USD first, then to target currency
      const usdAmount = amount / fromRate;
      return Math.round(usdAmount * toRate);
    },
    [getRate]
  );

  const getLastUpdated = useCallback((): string => {
    if (!rateCache.timestamp) return 'Never';
    const diff = Date.now() - rateCache.timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }, [rateCache.timestamp]);

  return {
    rates: rateCache.rates,
    isLoading,
    error,
    fetchRates,
    getRate,
    convert,
    getLastUpdated,
    isCacheValid: isCacheValid(),
  };
}
