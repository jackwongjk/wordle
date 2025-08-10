'use client';

import useLetterInputHook from '@/app/hooks/useLetterInputHook';
import useWordleGame from '@/app/hooks/useWordleGame';
import useWordTryHook from '@/app/hooks/useWordTryHook';
import AnswerReveal from '@/components/answer-reveal';
import CoverOverlay from '@/components/cover-overlay';
import GameControl from '@/components/game-control';
import Keyboard from '@/components/keyboard';
import TryList from '@/components/try-list';
import { GAME_STATUS, LETTER_COUNT, LETTER_REVEAL_DELAY } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const DELAY = LETTER_COUNT * LETTER_REVEAL_DELAY;

export default function WordleBody({ words = [], maxTries = 6 }) {
  const { gameId, status, error, startNewGame, sendGuess, restoreGame } =
    useWordleGame();
  const { input, backspaceInput, addInput, clearInput } = useLetterInputHook();
  const { tries, addTries, clearTries } = useWordTryHook();

  // To display the score for each try in TryList
  const [letterScoreList, setLetterScoreList] = useState([]);

  // For displaying the letter status of Keyboard
  const [letterPresentList, setLetterPresentList] = useState([]);
  const [letterHitList, setLetterHitList] = useState([]);
  const [letterMissList, setLetterMissList] = useState([]);

  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [roundEnd, setRoundEnd] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const gameReset = useCallback(() => {
    clearInput();
    clearTries();
    setRound(0);
    setLetterPresentList([]);
    setLetterHitList([]);
    setLetterMissList([]);
    startNewGame();
    setRoundEnd(false);
    setIsCorrect(false);
    setAnswer('');
  }, [startNewGame, clearTries, clearInput]);

  const gameRestore = useCallback(async () => {
    const {
      success,
      error: restoreError,
      tries: restoredTries,
      hit,
      present,
      miss,
      scoreForEachTry,
    } = await restoreGame();
    if (!success) {
      toast.error(restoreError || 'Failed to restore game');
      return;
    }
    if (!restoredTries) {
      return;
    }
    restoredTries.forEach((tryWord, index) => {
      addTries(tryWord.toUpperCase(), index);
    });
    setLetterScoreList(scoreForEachTry);
    setRound(restoredTries.length);
    setTimeout(() => {
      setLetterHitList(hit);
      setLetterPresentList(present);
      setLetterMissList(miss);
    }, DELAY);
  }, [restoreGame, addTries]);

  const onKeyPress = useCallback(
    async (key) => {
      if (roundEnd || status === GAME_STATUS.LOADING) {
        return;
      }
      switch (key) {
        case 'ENTER':
          const resp = await sendGuess(input.join(''));
          const {
            isCorrect,
            isGameOver,
            tries,
            success,
            hit,
            present,
            miss,
            scoreForEachTry,
            error: respError,
            answer: respAnswer,
          } = resp;
          if (!success) {
            toast.error(respError || 'Failed to submit guess');
            return;
          }
          if (respAnswer) {
            setAnswer(respAnswer);
          }
          setIsCorrect(isCorrect);
          // Update game state with delayed effect
          setTimeout(() => {
            setLetterHitList(hit);
            setLetterPresentList(present);
            setLetterMissList(miss);
            setRoundEnd(isGameOver);
            if (isCorrect) {
              toast.success('Congratulations! You guessed the word!');
            }
          }, DELAY);
          setLetterScoreList(scoreForEachTry);
          clearInput();
          setRound(tries.length - 1 + 1); // Increment round
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
    [input, backspaceInput, addInput, clearInput, roundEnd, sendGuess, status],
  );

  useEffect(() => {
    // When round changes, add the input to tries
    addTries(input, round);
  }, [input, round]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1 relative">
      <GameControl roundEnd={roundEnd} gameReset={gameReset} />
      <AnswerReveal answer={answer} roundEnd={roundEnd} />
      <TryList
        tries={tries}
        answer={answer}
        round={round}
        maxTries={maxTries}
        letterScoreList={letterScoreList}
      />
      <div className="mt-6">
        <Keyboard
          onKeyPress={onKeyPress}
          letterHitList={letterHitList}
          letterPresentList={letterPresentList}
          letterMissList={letterMissList}
          disabled={status === GAME_STATUS.LOADING}
        />
      </div>
      <CoverOverlay
        startGame={startNewGame}
        restoreGame={gameRestore}
        status={status}
        isVisible={!gameId}
      />
    </div>
  );
}
