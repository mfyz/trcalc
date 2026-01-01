interface KeypadProps {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
}

// Haptic feedback for supported devices
function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(1);
  }
}

export function Keypad({ onDigit, onClear, onBackspace, onEquals }: KeypadProps) {
  const buttonClass =
    'flex items-center justify-center text-2xl font-semibold transition-all duration-75 min-h-[60px]';
  const digitClass = `${buttonClass} bg-gradient-to-b from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-100 active:bg-gradient-to-t active:from-gray-100 active:to-gray-200 dark:active:from-gray-800 dark:active:to-gray-900 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`;
  const actionClass = `${buttonClass} bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200 active:bg-gradient-to-t active:from-gray-200 active:to-gray-300 dark:active:from-gray-700 dark:active:to-gray-800 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`;
  const deleteClass = `${buttonClass} bg-gradient-to-b from-red-400 to-red-500 text-white active:bg-gradient-to-t active:from-red-500 active:to-red-600 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]`;
  const equalsClass = `${buttonClass} bg-gradient-to-b from-blue-400 to-blue-500 text-white active:bg-gradient-to-t active:from-blue-500 active:to-blue-600 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] row-span-2`;

  const handleDigit = (digit: string) => {
    haptic();
    onDigit(digit);
  };

  const handleClear = () => {
    haptic();
    onClear();
  };

  const handleBackspace = () => {
    haptic();
    onBackspace();
  };

  const handleEquals = () => {
    haptic();
    onEquals();
  };

  return (
    <div className="grid grid-cols-4 border-t border-gray-200 dark:border-gray-700 -mx-4">
      {/* Row 1 */}
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('7')}>7</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('8')}>8</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('9')}>9</button>
      <button className={`${actionClass} border-b border-gray-200 dark:border-gray-600`} onClick={handleClear}>C</button>

      {/* Row 2 */}
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('4')}>4</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('5')}>5</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('6')}>6</button>
      <button className={`${deleteClass} border-b border-gray-200 dark:border-gray-600`} onClick={handleBackspace}>⌫</button>

      {/* Row 3 */}
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('1')}>1</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('2')}>2</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('3')}>3</button>
      <button className={equalsClass} onClick={handleEquals}>=</button>

      {/* Row 4 */}
      <button className={`${digitClass} col-span-2 border-r border-gray-200 dark:border-gray-600`} onClick={() => handleDigit('0')}>0</button>
      <button className={`${digitClass} border-r border-gray-200 dark:border-gray-600 text-xl`} onClick={() => handleDigit('000')}>000</button>
    </div>
  );
}
