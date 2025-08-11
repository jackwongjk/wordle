import { NextResponse } from 'next/server';
import { gameStore } from '../_gameStore';
import { findAvailableWords, getScore } from '../lib/utils';

// Get the word list from env
const WORD_LIST = process.env.WORDS
  ? process.env.WORDS.split(',').map((w) => w.trim().toLowerCase())
  : [];

const MAX_TRIES = process.env.MAX_TRIES
  ? parseInt(process.env.MAX_TRIES, 10)
  : 6;

export async function POST(request) {
  const { word, gameId } = await request.json();
  const guess = word.toLowerCase();

  // Validate format
  if (!/^[a-zA-Z]{5}$/.test(guess)) {
    return NextResponse.json(
      { error: 'Word must be 5 English letters.' },
      { status: 400 },
    );
  }

  // Validate existence
  if (!WORD_LIST.includes(guess)) {
    return NextResponse.json(
      { error: 'Word not found in list.' },
      { status: 404 },
    );
  }

  // Get game
  const game = gameStore.get(gameId);
  if (!game) {
    return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
  }

  // Add guess to tries
  game.tries = game.tries || [];
  game.tries.push(guess);

  const answer = findAvailableWords(game.tries, WORD_LIST);

  if (answer.length === 1) {
    game.answer = answer[0];
  } else {
    // If there are multiple answers, we cannot determine the correct one yet
    game.answer = null;
  }

  // Check win
  const isCorrect = answer.length > 1 ? false : guess === game.answer;

  const isGameOver = game.tries.length >= MAX_TRIES || isCorrect;

  const {
    score: { hit, present, miss },
    scoreForEachTry,
  } = getScore(game.tries, game.answer);

  return NextResponse.json({
    tries: game.tries,
    isCorrect,
    isGameOver,
    hit,
    present,
    miss,
    scoreForEachTry,
    answer: isGameOver ? game.answer : null,
  });
}
