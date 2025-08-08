'use client';

import { LETTER_COUNT, LETTER_REVEAL_DELAY } from '@/lib/utils';
import React, { useMemo, useEffect } from 'react';

const MAX_TRIES = process.env.MAX_TRIES
  ? parseInt(process.env.MAX_TRIES, 10)
  : 6;

export default function TryList({
  tries,
  answer,
  round,
  setLetterHitList,
  setLetterPresentList,
  setLetterMissList,
}) {
  const answerLetterList = useMemo(
    () => (answer ? answer.split('') : []),
    [answer],
  );

  useEffect(() => {
    if (round === 0) return;
    const currentRow = tries[round - 1] || [];
    const hitList = [];
    const presentList = [];
    const missList = [];

    // For each letter in the current guess row:
    currentRow.forEach((letter, letterIndex) => {
      const currentLetter = letter ? letter.toLowerCase() : null;
      const currentLetterFromAnswer = answerLetterList[letterIndex]
        ? answerLetterList[letterIndex].toLowerCase()
        : null;
      if (!currentLetter) return;
      if (
        currentLetter === currentLetterFromAnswer &&
        !hitList.includes(currentLetter)
      ) {
        hitList.push(currentLetter);
      } else if (
        answerLetterList.includes(currentLetter) &&
        !presentList.includes(currentLetter)
      ) {
        presentList.push(currentLetter);
      } else if (!missList.includes(currentLetter)) {
        missList.push(currentLetter);
      }
    });

    // Delay updating hit/present/miss lists until all boxes have revealed
    const delay = LETTER_COUNT * LETTER_REVEAL_DELAY;
    const timeout = setTimeout(() => {
      setLetterHitList((prev) => [
        ...prev,
        ...hitList.filter((l) => !prev.includes(l)),
      ]);
      setLetterPresentList((prev) => [
        ...prev.filter((l) => !hitList.includes(l)),
        ...presentList.filter((l) => !prev.includes(l) && !hitList.includes(l)),
      ]);
      setLetterMissList((prev) => [
        ...prev.filter((l) => !hitList.includes(l) && !presentList.includes(l)),
        ...missList.filter(
          (l) =>
            !prev.includes(l) &&
            !hitList.includes(l) &&
            !presentList.includes(l),
        ),
      ]);
    }, delay);

    return () => clearTimeout(timeout);
  }, [
    round,
    tries,
    answerLetterList,
    setLetterHitList,
    setLetterPresentList,
    setLetterMissList,
  ]);

  return (
    <>
      {Array(MAX_TRIES)
        .fill(null)
        .map((_, index) => {
          const currentRow = tries[index] || [];
          // Fill the row to LETTER_COUNT with nulls
          const filledRow = Array(LETTER_COUNT)
            .fill(null)
            .map((_, i) => currentRow[i] ?? null);

          const canRevealGuess = index < round;
          console.log({ filledRow, round, canRevealGuess });

          return (
            <div key={index} className="flex justify-center gap-1">
              {filledRow.map((letter, letterIndex) => {
                const currentLetterFromAnswer = answerLetterList[letterIndex]
                  ? answerLetterList[letterIndex].toLowerCase()
                  : null;
                const currentLetter = letter ? letter.toLowerCase() : null;

                // The letter is in the correct spot of answer
                const hit = currentLetter === currentLetterFromAnswer;
                // The letter is in the answer but wrong spot
                const present = answerLetterList.includes(currentLetter);

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
