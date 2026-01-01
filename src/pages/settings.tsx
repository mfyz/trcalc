import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Settings,
  HistoryEntry,
  Multiplier,
  Currency,
  Theme,
  DEFAULT_SETTINGS,
  CURRENCIES,
  STORAGE_KEYS,
} from '@/types';

export default function SettingsPage() {
  const [settings, setSettings, settingsLoaded] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );
  const [history, setHistory, historyLoaded] = useLocalStorage<HistoryEntry[]>(
    STORAGE_KEYS.history,
    []
  );

  const [newMultiplierLabel, setNewMultiplierLabel] = useState('');
  const [newMultiplierValue, setNewMultiplierValue] = useState('');
  const [newQuickValue, setNewQuickValue] = useState('');

  useEffect(() => {
    if (settingsLoaded && settings.firstVisit) {
      setSettings((prev) => ({ ...prev, firstVisit: false }));
    }
  }, [settingsLoaded, settings.firstVisit, setSettings]);

  const handleCurrencyChange = (currency: Exclude<Currency, 'USD'>) => {
    setSettings((prev) => ({ ...prev, targetCurrency: currency }));
  };

  const handleAutoResetToggle = () => {
    setSettings((prev) => ({ ...prev, autoReset: !prev.autoReset }));
  };

  const handleThemeChange = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const handleAddQuickValue = () => {
    const value = parseInt(newQuickValue);
    if (isNaN(value) || value <= 0) return;
    if (settings.quickValues.includes(value)) return;

    setSettings((prev) => ({
      ...prev,
      quickValues: [...prev.quickValues, value].sort((a, b) => a - b),
    }));
    setNewQuickValue('');
  };

  const handleDeleteQuickValue = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      quickValues: prev.quickValues.filter((v) => v !== value),
    }));
  };

  const handleAddMultiplier = () => {
    if (!newMultiplierLabel.trim() || !newMultiplierValue.trim()) return;
    const value = parseInt(newMultiplierValue);
    if (isNaN(value)) return;

    const newMultiplier: Multiplier = {
      id: Date.now().toString(),
      label: newMultiplierLabel.trim(),
      value,
    };

    setSettings((prev) => ({
      ...prev,
      multipliers: [...prev.multipliers, newMultiplier],
    }));

    setNewMultiplierLabel('');
    setNewMultiplierValue('');
  };

  const handleDeleteMultiplier = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      multipliers: prev.multipliers.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateMultiplier = (id: string, field: 'label' | 'value', value: string) => {
    setSettings((prev) => ({
      ...prev,
      multipliers: prev.multipliers.map((m) => {
        if (m.id !== id) return m;
        if (field === 'label') return { ...m, label: value };
        const numValue = parseInt(value);
        return { ...m, value: isNaN(numValue) ? m.value : numValue };
      }),
    }));
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  if (!settingsLoaded || !historyLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const targetCurrencies = CURRENCIES.filter((c) => c.code !== 'USD');

  return (
    <>
      <Head>
        <title>Settings - TRCalc</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-2 -ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-2">Settings</h1>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-md mx-auto p-4 space-y-6">
          {/* Welcome message for first visit */}
          {settings.firstVisit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-800">Welcome to TRCalc!</h2>
              <p className="text-sm text-blue-600 mt-1">
                Configure your calculator preferences below.
              </p>
            </div>
          )}

          {/* Target Currency */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {targetCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code as Exclude<Currency, 'USD'>)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    settings.targetCurrency === currency.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{currency.symbol}</span>
                    <span className="font-medium dark:text-gray-100">{currency.code}</span>
                    <span className="text-gray-500 dark:text-gray-400">- {currency.name}</span>
                  </div>
                  {settings.targetCurrency === currency.code && (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Auto-Reset */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAutoResetToggle}
              className="w-full flex items-center justify-between p-3"
            >
              <div>
                <div className="font-medium text-left dark:text-gray-100">Reset on app refocus</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-left">
                  When enabled, typing after returning saves current calc to history
                </div>
              </div>
              <div
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  settings.autoReset ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoReset ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </section>

          {/* Theme */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm capitalize transition-colors ${
                    settings.theme === theme
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </section>

          {/* Multiplier Buttons */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {settings.multipliers.map((multiplier) => (
                <div
                  key={multiplier.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <input
                    type="text"
                    value={multiplier.label}
                    onChange={(e) =>
                      handleUpdateMultiplier(multiplier.id, 'label', e.target.value)
                    }
                    className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded text-sm"
                    placeholder="Label"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={multiplier.value}
                      onChange={(e) =>
                        handleUpdateMultiplier(multiplier.id, 'value', e.target.value)
                      }
                      className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded text-sm text-right"
                      placeholder="Value"
                    />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">%</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMultiplier(multiplier.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add new multiplier */}
              <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                <input
                  type="text"
                  value={newMultiplierLabel}
                  onChange={(e) => setNewMultiplierLabel(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded text-sm"
                  placeholder="Label (e.g., +KDV)"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={newMultiplierValue}
                    onChange={(e) => setNewMultiplierValue(e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded text-sm text-right"
                    placeholder="18"
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">%</span>
                </div>
                <button
                  onClick={handleAddMultiplier}
                  disabled={!newMultiplierLabel.trim() || !newMultiplierValue.trim()}
                  className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Quick Values */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {settings.quickValues.map((value) => (
                <div
                  key={value}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="font-medium dark:text-gray-100">{value.toLocaleString()}</span>
                  <button
                    onClick={() => handleDeleteQuickValue(value)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Add new quick value */}
              <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                <input
                  type="number"
                  value={newQuickValue}
                  onChange={(e) => setNewQuickValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddQuickValue()}
                  className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded text-sm"
                  placeholder="Enter amount"
                />
                <button
                  onClick={handleAddQuickValue}
                  disabled={!newQuickValue.trim()}
                  className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Clear History */}
          <section className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="w-full py-2 px-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium
                         hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear History ({history.length} entries)
            </button>
          </section>
        </main>
      </div>
    </>
  );
}
