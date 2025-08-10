'use client';

import { GAME_STATUS } from '@/lib/utils';
import { useCallback, useState } from 'react';

export default function useWordleGame() {
  const [gameId, setGameId] = useState(null);
  const [status, setStatus] = useState(GAME_STATUS.IDLE); // idle | playing | win | lose | loading
  const [error, setError] = useState(null);

  // Start a new game
  const startNewGame = useCallback(async () => {
    if (status === GAME_STATUS.LOADING) {
      return;
    }
    setError(null);
    setStatus(GAME_STATUS.LOADING);
    try {
      const res = await fetch('/api/new-game');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start new game');
      setGameId(data.gameId);
      localStorage.setItem('gameId', JSON.stringify(data.gameId));
      setStatus(GAME_STATUS.PLAYING);
    } catch (err) {
      setError(err.message);
      setStatus(GAME_STATUS.IDLE);
    }
  }, [status]);

  // Restore game from localStorage
  const restoreGame = async () => {
    const savedGameId = localStorage.getItem('gameId');
    if (!savedGameId) {
      setStatus(GAME_STATUS.IDLE);
      return;
    }
    const existingGameId = JSON.parse(savedGameId);
    try {
      const res = await fetch('/api/restore-game/' + existingGameId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to restore game');
      setGameId(JSON.parse(savedGameId));
      setStatus(GAME_STATUS.PLAYING);
      return { ...data, success: true };
    } catch (err) {
      setError(err.message);
      setStatus(GAME_STATUS.IDLE);
      return { success: false, error: err.message };
    }
  };

  // Send user input
  const sendGuess = async (word) => {
    setError(null);
    setStatus(GAME_STATUS.LOADING);

    if (!gameId) {
      setError('No game started');
      return { valid: false };
    }
    try {
      const res = await fetch('/api/submit-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, gameId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Validation failed');
      if (data.isGameOver) {
        localStorage.removeItem('gameId');
        setStatus(data.isCorrect ? GAME_STATUS.WIN : GAME_STATUS.LOSE);
      } else {
        setStatus(GAME_STATUS.PLAYING);
      }
      return { ...data, success: true };
    } catch (err) {
      setError(err.message);
      setStatus(GAME_STATUS.PLAYING);
      return { success: false, error: err.message };
    }
  };

  return {
    gameId,
    status,
    error,
    startNewGame,
    sendGuess,
    restoreGame,
  };
}
