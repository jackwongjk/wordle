'use client';
import { LETTER_COUNT, LETTER_REVEAL_DELAY } from '@/lib/utils';
import React from 'react';

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export default function Keyboard({
  onKeyPress,
  letterHitList,
  letterPresentList,
  letterMissList,
  disabled = false,
}) {
  const handleClick = (key) => {
    if (!onKeyPress) return;
    onKeyPress(key);
  };

  return (
    <div className="inline-block w-full select-none">
      {KEYS.map((row, rowIdx) => (
        <div key={rowIdx} className="mb-2 flex justify-center gap-1 w-full">
          {row.map((key) => (
            <button
              disabled={disabled}
              key={key}
              onClick={() => handleClick(key)}
              className={`
                flex-1
                m-0.5 px-2 py-3 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 cursor-pointer
                sm:px-4 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${key === 'ENTER' ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}
                ${key === 'ENTER' || key === 'BACKSPACE' ? 'min-w-[56px] sm:min-w-[72px] flex-[1.5]' : 'min-w-[28px] sm:min-w-[40px]'}
                ${letterHitList.includes(key.toLowerCase()) ? 'bg-green-500 text-white' : ''}
                ${letterPresentList.includes(key.toLowerCase()) ? 'bg-yellow-500 text-white' : ''}
                ${letterMissList.includes(key.toLowerCase()) ? 'bg-gray-300 text-gray-700' : ''}
              `}
              style={{ maxWidth: 56 }}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
