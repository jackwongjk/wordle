import { GAME_STATUS } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export default function CoverOverlay({
  isVisible,
  status,
  startGame,
  restoreGame,
}) {
  const [displayClassname, setDisplayClassname] = useState('flex');
  const [opacityClassname, setOpacityClassname] = useState('opacity-100');
  const [hasPastGame, setHasPastGame] = useState(false);

  useEffect(() => {
    const savedGameId = localStorage.getItem('gameId');
    if (!savedGameId) {
      return;
    }
    setHasPastGame(true);
  }, []);

  useEffect(() => {
    setOpacityClassname(isVisible ? 'opacity-100' : 'opacity-0');
    const timeoutId = setTimeout(() => {
      setDisplayClassname(isVisible ? 'flex' : 'hidden');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  return (
    <div
      className={`${displayClassname} ${opacityClassname} transition-opacity duration-1000 fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs`}
    >
      <div className="grid place-items-center gap-4 p-4 rounded">
        <h1 className="sm:text-5xl text-4xl text-white font-bold tracking-wider">
          WORDLE
        </h1>
        <button
          onClick={startGame}
          disabled={
            status === GAME_STATUS.LOADING || status === GAME_STATUS.PLAYING
          }
          className="sm::text-2xl text-xl px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 hover:scale-110 transition-all duration-300 disabled:opacity-50"
        >
          Start Game
        </button>
        {hasPastGame && (
          <button
            onClick={restoreGame}
            disabled={
              status === GAME_STATUS.LOADING || status === GAME_STATUS.PLAYING
            }
            className="sm::text-2xl text-xl px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            Restore Game
          </button>
        )}
      </div>
    </div>
  );
}
