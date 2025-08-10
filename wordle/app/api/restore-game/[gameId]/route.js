import { NextResponse } from 'next/server';
import { gameStore } from '../../_gameStore';
import { getScore } from '../../lib/utils';

const WORD_LIST = process.env.WORDS
  ? process.env.WORDS.split(',').map((w) => w.trim().toLowerCase())
  : [];

// Use a simple counter for gameId
let lastGameId = 0;

function generateIncrementalGameId() {
  lastGameId += 1;
  return lastGameId.toString();
}

export async function GET(request, { params }) {
  const { gameId } = await params;

  if (!gameId) {
    return NextResponse.json(
      { error: 'Game ID is required.' },
      { status: 400 },
    );
  }

  const gameStatus = gameStore.get(gameId);
  if (!gameStatus) {
    return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
  }
  const {
    score: { hit, present, miss },
    scoreForEachTry,
  } = getScore(gameStatus.tries, gameStatus.answer);

  // If the game is not over, we can restore it
  return NextResponse.json({
    gameId,
    tries: gameStatus.tries,
    hit,
    present,
    miss,
    scoreForEachTry,
  });
}
