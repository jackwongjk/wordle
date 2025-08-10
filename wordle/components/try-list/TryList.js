'use client';

import { LETTER_COUNT, LETTER_REVEAL_DELAY } from '@/lib/utils';
import React, { useMemo, useEffect } from 'react';

export default function TryList({
  tries,
  round,
  maxTries = 6,
  letterScoreList,
}) {
  return (
    <>
      {Array(maxTries)
        .fill(null)
        .map((_, index) => {
          const currentRow = tries[index] || [];
          const currentRowScore = letterScoreList[index] || [];
          // Fill the row to LETTER_COUNT with nulls
          const filledRow = Array(LETTER_COUNT)
            .fill(null)
            .map((_, i) => currentRow[i] ?? null);

          const canRevealGuess = index < round;

          return (
            <div key={index} className="flex justify-center gap-1">
              {filledRow.map((letter, letterIndex) => {
                const currentLetter = letter ? letter.toLowerCase() : null;

                // The letter is in the correct spot of answer
                const hit = currentRowScore[letterIndex] === 'hit';
                // The letter is in the answer but wrong spot
                const present = currentRowScore[letterIndex] === 'present';

                let boxEffect = '';

                switch (true) {
                  case hit:
                    boxEffect = 'bg-green-500 text-white';
                    break;
                  case present:
                    boxEffect = 'bg-yellow-500 text-white';
                    break;
                  default: // letter is not in the answer
                    boxEffect = 'bg-gray-300 text-gray-700';
                }

                return (
                  <div
                    key={letterIndex}
                    className={`h-12 w-12 border border-gray-600 rounded flex items-center justify-center transition-all duration-300 ${canRevealGuess ? boxEffect : ''}`}
                    style={
                      canRevealGuess
                        ? {
                            transitionDelay: `${letterIndex * LETTER_REVEAL_DELAY}ms`,
                          }
                        : {}
                    }
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
    </>
  );
}
