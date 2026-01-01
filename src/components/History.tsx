import { useState, useRef, useEffect } from 'react';
import { HistoryEntry, CURRENCIES } from '@/types';

interface HistoryProps {
  entries: HistoryEntry[];
  onClear?: () => void;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(num);
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function getCurrencySymbol(currency: string): string {
  return CURRENCIES.find((c) => c.code === currency)?.symbol || currency;
}

function getCurrencyColor(currency: string): string {
  return currency === 'USD' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400';
}

function HistoryItem({ entry, showTime = true }: { entry: HistoryEntry; showTime?: boolean }) {
  const fromSymbol = getCurrencySymbol(entry.fromCurrency);
  const toSymbol = getCurrencySymbol(entry.toCurrency);
  const fromColor = getCurrencyColor(entry.fromCurrency);
  const toColor = getCurrencyColor(entry.toCurrency);

  return (
    <div className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 rounded px-3 py-1.5">
      <div className="flex-1 truncate">
        <span className={`font-medium ${fromColor}`}>
          {fromSymbol}{formatNumber(entry.inputValue)}
        </span>
        {entry.modifier && (
          <span className="text-purple-600 ml-1 text-xs">({entry.modifier.label})</span>
        )}
        <span className="text-gray-400 dark:text-gray-500 mx-1">→</span>
        <span className={`font-medium ${toColor}`}>
          {toSymbol}{formatNumber(entry.outputValue)}
        </span>
      </div>
      {showTime && (
        <span className="text-gray-400 dark:text-gray-500 text-xs ml-2 flex-shrink-0">
          {formatTime(entry.timestamp)}
        </span>
      )}
    </div>
  );
}

export function History({ entries, onClear }: HistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;
    const diff = clientY - dragStartY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleDragEnd = () => {
    if (dragY > 150) {
      setIsExpanded(false);
    }
    setDragY(0);
    setIsDragging(false);
  };

  const previewEntries = entries.slice(0, 4);

  if (entries.length === 0) return null;

  return (
    <>
      {/* Compact preview - clickable to expand */}
      <div
        className="w-full cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            History ({entries.length})
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {previewEntries.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} showTime={false} />
          ))}
        </div>
      </div>

      {/* Fullscreen modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black/50 transition-opacity"
          onClick={() => setIsExpanded(false)}
        >
          <div
            ref={modalRef}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[85vh] flex flex-col transition-transform"
            style={{
              transform: `translateY(${dragY}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleDragStart(e.clientY)}
              onMouseMove={(e) => handleDragMove(e.clientY)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
              onTouchEnd={handleDragEnd}
            >
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold dark:text-gray-100">History</h2>
              <div className="flex items-center gap-6">
                {onClear && (
                  <button
                    onClick={() => {
                      onClear();
                      setIsExpanded(false);
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 pb-8 space-y-2">
              {entries.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
