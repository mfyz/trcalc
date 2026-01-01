import Head from 'next/head';
import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Settings, DEFAULT_SETTINGS, STORAGE_KEYS } from '@/types';

export default function Home() {
  const [settings, setSettings, isLoaded] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );

  const toggleAutoReset = () => {
    setSettings((prev) => ({ ...prev, autoReset: !prev.autoReset }));
  };

  return (
    <>
      <Head>
        <title>TRCalc</title>
        <meta name="description" content="Mobile-first currency calculator" />

        {/* Viewport - prevent zoom */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />

        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TRCalc" />
        <link rel="apple-touch-icon" href="/icon.svg" />

        {/* Android PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />

        {/* Prevent text selection and touch callout */}
        <meta name="format-detection" content="telephone=no" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-between">
            <Link
              href="/settings"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>

            {/* Rate info moved to header - will be updated by Calculator */}
            <div id="rate-info" className="text-xs text-gray-500 dark:text-gray-400 flex-1 text-center" />

            {isLoaded && (
              <button
                id="auto-reset-btn"
                onClick={toggleAutoReset}
                className="p-1.5 rounded-full transition-colors"
                title={settings.autoReset ? 'Auto-reset ON' : 'Auto-reset OFF'}
              >
                <svg
                  id="auto-reset-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <Calculator />
        </main>
      </div>
    </>
  );
}
