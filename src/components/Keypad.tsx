interface KeypadProps {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
}

export function Keypad({ onDigit, onClear, onBackspace, onEquals }: KeypadProps) {
  const buttonClass =
    'flex items-center justify-center text-2xl font-semibold transition-colors min-h-[60px]';
  const digitClass = `${buttonClass} bg-gradient-to-b from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-100 active:from-gray-100 active:to-gray-200 dark:active:from-gray-600 dark:active:to-gray-700`;
  const actionClass = `${buttonClass} bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200 active:from-gray-200 active:to-gray-300 dark:active:from-gray-500 dark:active:to-gray-600`;
  const deleteClass = `${buttonClass} bg-gradient-to-b from-red-400 to-red-500 text-white active:from-red-500 active:to-red-600`;
  const equalsClass = `${buttonClass} bg-gradient-to-b from-blue-400 to-blue-500 text-white active:from-blue-500 active:to-blue-600 row-span-2`;

  return (
    <div className="grid grid-cols-4 border-t border-gray-200 dark:border-gray-700 -mx-4">
      {/* Row 1 */}
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('7')}>7</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('8')}>8</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('9')}>9</button>
      <button className={`${actionClass} border-b border-gray-200 dark:border-gray-600`} onClick={onClear}>C</button>

      {/* Row 2 */}
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('4')}>4</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('5')}>5</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('6')}>6</button>
      <button className={`${deleteClass} border-b border-gray-200 dark:border-gray-600`} onClick={onBackspace}>⌫</button>

      {/* Row 3 */}
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('1')}>1</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('2')}>2</button>
      <button className={`${digitClass} border-r border-b border-gray-200 dark:border-gray-600`} onClick={() => onDigit('3')}>3</button>
      <button className={equalsClass} onClick={onEquals}>=</button>

      {/* Row 4 */}
      <button className={`${digitClass} col-span-3 border-r border-gray-200 dark:border-gray-600`} onClick={() => onDigit('0')}>0</button>
    </div>
  );
}
