import { useState, useEffect, useCallback, useRef } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { MultiplierButtons } from './MultiplierButtons';
import { QuickValues } from './QuickValues';
import { History } from './History';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useFocusDetection } from '@/hooks/useFocusDetection';
import {
  Settings,
  HistoryEntry,
  Multiplier,
  Currency,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
} from '@/types';

export function Calculator() {
  const [inputValue, setInputValue] = useState(0);
  const [pendingReset, setPendingReset] = useState(false);

  const [settings, setSettings, settingsLoaded] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const [history, setHistory, historyLoaded] = useLocalStorage<HistoryEntry[]>(
    STORAGE_KEYS.history,
    []
  );

  const { rates, getRate, getLastUpdated, isLoading } = useExchangeRate();

  // Determine from/to currencies based on swap state
  const fromCurrency: Currency = settings.isReversed ? settings.targetCurrency : 'USD';
  const toCurrency: Currency = settings.isReversed ? 'USD' : settings.targetCurrency;

  // Calculate the conversion rate for current direction
  const targetRate = getRate(settings.targetCurrency);
  const rate = settings.isReversed ? 1 / targetRate : targetRate;

  // Refs to access current values in onHide callback
  const inputValueRef = useRef(inputValue);
  const rateRef = useRef(rate);
  const fromCurrencyRef = useRef(fromCurrency);
  const toCurrencyRef = useRef(toCurrency);
  const setHistoryRef = useRef(setHistory);
  const autoResetRef = useRef(settings.autoReset);

  // Keep refs updated
  useEffect(() => {
    inputValueRef.current = inputValue;
    rateRef.current = rate;
    fromCurrencyRef.current = fromCurrency;
    toCurrencyRef.current = toCurrency;
    setHistoryRef.current = setHistory;
    autoResetRef.current = settings.autoReset;
  }, [inputValue, rate, fromCurrency, toCurrency, setHistory, settings.autoReset]);

  // Save to history when app goes to background (if auto-reset is enabled and there's a value)
  const handleAppHide = useCallback(() => {
    if (autoResetRef.current && inputValueRef.current > 0) {
      const outputValue = Math.round(inputValueRef.current * rateRef.current);
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        inputValue: inputValueRef.current,
        outputValue,
        fromCurrency: fromCurrencyRef.current,
        toCurrency: toCurrencyRef.current,
        rate: rateRef.current,
        modifier: null,
        timestamp: Date.now(),
      };
      setHistoryRef.current((prev) => [entry, ...prev].slice(0, 50));
    }
  }, []);

  const { wasHidden, resetWasHidden } = useFocusDetection({ onHide: handleAppHide });

  // Handle auto-reset on focus return
  useEffect(() => {
    if (settings.autoReset && wasHidden && inputValue > 0) {
      setPendingReset(true);
    }
  }, [wasHidden, settings.autoReset, inputValue]);

  const saveToHistory = useCallback(
    (modifier: Multiplier | null = null) => {
      if (inputValue === 0) return;

      let finalInputValue = inputValue;
      if (modifier) {
        if (modifier.value > 0) {
          finalInputValue = Math.round(inputValue * (1 + modifier.value / 100));
        } else {
          finalInputValue = Math.round(inputValue / (1 + Math.abs(modifier.value) / 100));
        }
      }

      const outputValue = Math.round(finalInputValue * rate);

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        inputValue: finalInputValue,
        outputValue,
        fromCurrency,
        toCurrency,
        rate,
        modifier: modifier ? { label: modifier.label, value: modifier.value } : null,
        timestamp: Date.now(),
      };

      setHistory((prev) => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
    },
    [inputValue, rate, fromCurrency, toCurrency, setHistory]
  );

  const handleDigit = useCallback(
    (digit: string) => {
      // Handle pending reset on first keypress after focus return
      // Note: if auto-reset is enabled, value was already saved when app went to background
      if (pendingReset) {
        setInputValue(0);
        setPendingReset(false);
        resetWasHidden();
      }

      setInputValue((prev) => {
        const newValue = prev * 10 + parseInt(digit);
        // Limit to reasonable number
        if (newValue > 999999999) return prev;
        return newValue;
      });
    },
    [pendingReset, resetWasHidden]
  );

  const handleClear = useCallback(() => {
    setInputValue(0);
    setPendingReset(false);
    resetWasHidden();
  }, [resetWasHidden]);

  const handleBackspace = useCallback(() => {
    setInputValue((prev) => Math.floor(prev / 10));
  }, []);

  const handleEquals = useCallback(() => {
    if (inputValue > 0) {
      saveToHistory();
      setInputValue(0);
    }
  }, [inputValue, saveToHistory]);

  const handleMultiplier = useCallback(
    (multiplier: Multiplier) => {
      if (inputValue > 0) {
        let newValue: number;
        if (multiplier.value > 0) {
          newValue = Math.round(inputValue * (1 + multiplier.value / 100));
        } else {
          newValue = Math.round(inputValue / (1 + Math.abs(multiplier.value) / 100));
        }
        // Just update the value - don't save to history until equals is pressed
        setInputValue(newValue);
      }
    },
    [inputValue]
  );

  const handleQuickValue = useCallback(
    (value: number) => {
      // Note: if auto-reset is enabled, previous value was already saved when app went to background
      if (pendingReset) {
        setPendingReset(false);
        resetWasHidden();
      }
      setInputValue(value);
    },
    [pendingReset, resetWasHidden]
  );

  const handleSwap = useCallback(() => {
    setSettings((prev) => ({ ...prev, isReversed: !prev.isReversed }));
  }, [setSettings]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  // Update navbar rate info - always show target currency rate
  useEffect(() => {
    const rateInfoEl = document.getElementById('rate-info');
    if (rateInfoEl) {
      const targetRate = getRate(settings.targetCurrency);
      const rateText = `1 USD = ${targetRate.toFixed(2)} ${settings.targetCurrency}`;
      const updateText = isLoading ? 'Updating...' : getLastUpdated();
      rateInfoEl.textContent = `${rateText} · ${updateText}`;
    }
  }, [settings.targetCurrency, isLoading, getLastUpdated, getRate]);

  // Update auto-reset icon state
  useEffect(() => {
    const iconEl = document.getElementById('auto-reset-icon');
    if (iconEl) {
      if (!settings.autoReset) {
        // Disabled: gray outline with 40% opacity
        iconEl.setAttribute('fill', 'none');
        iconEl.setAttribute('class', 'h-5 w-5 text-gray-400 opacity-40 transition-opacity');
      } else if (pendingReset) {
        // Enabled + pending: filled yellow
        iconEl.setAttribute('fill', 'currentColor');
        iconEl.setAttribute('class', 'h-5 w-5 text-amber-400 transition-opacity');
      } else {
        // Enabled, normal: neutral color like gear icon
        iconEl.setAttribute('fill', 'currentColor');
        iconEl.setAttribute('class', 'h-5 w-5 text-gray-600 dark:text-gray-400 transition-opacity');
      }
    }
  }, [settings.autoReset, pendingReset]);

  if (!settingsLoaded || !historyLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto px-2 py-2">
      {/* History preview - above input */}
      {history.length > 0 && (
        <div className="mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 -mx-1">
          <History entries={history} onClear={handleClearHistory} />
        </div>
      )}

      {/* Display */}
      <div className="mb-3">
        <Display
          value={inputValue}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          rate={rate}
          onSwap={handleSwap}
        />
      </div>

      {/* Spacer to push buttons to bottom */}
      <div className="flex-1 min-h-0" />

      {/* Multiplier and quick value buttons */}
      <div className="space-y-2 pb-2 flex-shrink-0">
        <MultiplierButtons
          multipliers={settings.multipliers}
          onMultiplier={handleMultiplier}
        />
        <QuickValues values={settings.quickValues} onSelect={handleQuickValue} />
      </div>

      {/* Keypad - full width, stick to bottom */}
      <div className="flex-shrink-0 -mb-2">
        <Keypad
          onDigit={handleDigit}
          onClear={handleClear}
          onBackspace={handleBackspace}
          onEquals={handleEquals}
        />
      </div>
    </div>
  );
}
