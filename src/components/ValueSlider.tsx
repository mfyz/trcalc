import { useCallback, useMemo } from 'react';

interface ValueSliderProps {
  value: number;
  onChange: (value: number) => void;
}

// Logarithmic scale: map 0-100 slider position to 0-100M value
const MIN_VALUE = 0;
const MAX_VALUE = 100000000;
const LOG_MIN = 0; // We'll handle 0 specially
const LOG_MAX = Math.log10(MAX_VALUE); // 8

// Key markers to display
const MARKERS = [
  { value: 1000, label: '1k' },
  { value: 100000, label: '100k' },
  { value: 1000000, label: '1m' },
  { value: 10000000, label: '10m' },
  { value: 100000000, label: '100m' },
];

function valueToSliderPosition(value: number): number {
  if (value <= 0) return 0;
  if (value >= MAX_VALUE) return 100;
  // Use log scale, but reserve first 5% for 0-1000 range linearly
  if (value <= 1000) {
    return (value / 1000) * 5;
  }
  // Log scale from 1000 to 100M maps to 5-100
  const logValue = Math.log10(value);
  const logMin = Math.log10(1000); // 3
  return 5 + ((logValue - logMin) / (LOG_MAX - logMin)) * 95;
}

function sliderPositionToValue(position: number): number {
  if (position <= 0) return 0;
  if (position >= 100) return MAX_VALUE;
  // First 5% is linear 0-1000
  if (position <= 5) {
    return Math.round((position / 5) * 1000);
  }
  // Rest is logarithmic
  const logMin = Math.log10(1000); // 3
  const logValue = logMin + ((position - 5) / 95) * (LOG_MAX - logMin);
  return Math.pow(10, logValue);
}

function roundToNiceNumber(value: number): number {
  if (value <= 0) return 0;
  if (value < 100) return Math.round(value / 10) * 10;
  if (value < 1000) return Math.round(value / 50) * 50;
  if (value < 10000) return Math.round(value / 500) * 500;
  if (value < 100000) return Math.round(value / 5000) * 5000;
  if (value < 1000000) return Math.round(value / 50000) * 50000;
  if (value < 10000000) return Math.round(value / 500000) * 500000;
  return Math.round(value / 5000000) * 5000000;
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(1);
  }
}

export function ValueSlider({ value, onChange }: ValueSliderProps) {
  const sliderPosition = useMemo(() => valueToSliderPosition(value), [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const position = parseFloat(e.target.value);
      const rawValue = sliderPositionToValue(position);
      const roundedValue = roundToNiceNumber(rawValue);
      onChange(roundedValue);
    },
    [onChange]
  );

  const handleTouchStart = useCallback(() => {
    haptic();
  }, []);

  const markerPositions = useMemo(
    () =>
      MARKERS.map((marker) => ({
        ...marker,
        position: valueToSliderPosition(marker.value),
      })),
    []
  );

  return (
    <div className="w-full px-2.5">
      <div className="relative pt-2 pb-4">
        {/* Slider input */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={sliderPosition}
          onChange={handleChange}
          onTouchStart={handleTouchStart}
          onMouseDown={handleTouchStart}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer relative z-10
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-blue-500
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:active:bg-blue-600
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-blue-500
                     [&::-moz-range-thumb]:border-0
                     [&::-moz-range-thumb]:shadow-md
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:active:bg-blue-600"
        />

        {/* Marker ticks and labels - positioned on track */}
        {markerPositions.map((marker) => (
          <div
            key={marker.value}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{ left: `${marker.position}%`, top: '8px', transform: 'translateX(-50%)' }}
          >
            <div className="w-px h-3 bg-gray-400 dark:bg-gray-500" />
            <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 whitespace-nowrap">
              {marker.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
