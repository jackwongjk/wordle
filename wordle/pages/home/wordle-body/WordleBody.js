'use client';

import useLetterInputHook from '@/app/hooks/useLetterInputHook';
import useWordTryHook from '@/app/hooks/useWordTryHook';
import AnswerReveal from '@/components/answer-reveal';
import GameControl from '@/components/game-control';
import Keyboard from '@/components/keyboard';
import TryList from '@/components/try-list';
import { LETTER_COUNT, LETTER_REVEAL_DELAY } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function WordleBody({ words = [], maxTries = 6 }) {
  const { input, backspaceInput, addInput, clearInput } = useLetterInputHook();
  const { tries, addTries, clearTries } = useWordTryHook();

  const [letterPresentList, setLetterPresentList] = useState([]);
  const [letterHitList, setLetterHitList] = useState([]);
  const [letterMissList, setLetterMissList] = useState([]);

  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [roundEnd, setRoundEnd] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const wordList = useMemo(() => words.split(','), [words]);

  const resetAnswer = useCallback(() => {
    if (wordList.length === 0) {
      toast.error('No words available');
      return;
    }
    setAnswer(wordList[Math.floor(Math.random() * wordList.length)]);
  }, [wordList]);

  useEffect(() => {
    resetAnswer();
  }, [resetAnswer]);

  const gameReset = useCallback(() => {
    clearInput();
    clearTries();
    setRound(0);
    setLetterPresentList([]);
    setLetterHitList([]);
    setLetterMissList([]);
    resetAnswer();
    setRoundEnd(false);
  }, [resetAnswer, clearTries, clearInput]);

  const onKeyPress = useCallback(
    (key) => {
      if (roundEnd) {
        return;
      }
      let delay = LETTER_COUNT * LETTER_REVEAL_DELAY;
      switch (key) {
        case 'ENTER':
          // When input is not complete
          if (input.length < LETTER_COUNT) {
            toast.error('Not enough letters');
            break;
          }
          // Check if the word is valid
          if (!wordList.includes(input.join('').toLowerCase())) {
            toast.error('Not in word list');
            break;
          }
          const isCorrectWord =
            input.join('').toLowerCase() === answer.toLowerCase();
          // Check if the word is correct
          if (isCorrectWord) {
            // For animation delay
            setTimeout(() => {
              setIsCorrect(true);
              toast.success('Congratulations! You guessed the word!');
              setRoundEnd(true);
            }, delay);
          }
          // When maxTries is reached
          if (round >= maxTries - 1 && !isCorrectWord) {
            // For animation delay
            setTimeout(() => {
              setRoundEnd(true);
              toast.error('Maximum tries reached');
            }, delay);
          }
          clearInput();
          setRound((prevRound) => prevRound + 1);
          break;
        case 'BACKSPACE':
          // Handle backspace logic
          backspaceInput();
          break;
        default:
          // Handle letter key logic
          if (input.length >= LETTER_COUNT) {
            return;
          }
          addInput(key);
          break;
      }
    },
    [
      input,
      backspaceInput,
      addInput,
      clearInput,
      wordList,
      round,
      answer,
      maxTries,
      roundEnd,
    ],
  );

  useEffect(() => {
    // When round changes, add the input to tries
    addTries(input, round);
  }, [input, round]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1">
      <GameControl roundEnd={roundEnd} gameReset={gameReset} />
      <AnswerReveal answer={answer} roundEnd={roundEnd} />
      <TryList
        tries={tries}
        answer={answer}
        round={round}
        setLetterHitList={setLetterHitList}
        setLetterPresentList={setLetterPresentList}
        setLetterMissList={setLetterMissList}
        maxTries={maxTries}
      />
      <div className="mt-6">
        <Keyboard
          onKeyPress={onKeyPress}
          letterHitList={letterHitList}
          letterPresentList={letterPresentList}
          letterMissList={letterMissList}
        />
      </div>
    </div>
  );
}
