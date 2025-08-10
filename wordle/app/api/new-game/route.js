import { NextResponse } from 'next/server';
import { gameStore } from '../_gameStore';

const WORD_LIST = process.env.WORDS
  ? process.env.WORDS.split(',').map((w) => w.trim().toLowerCase())
  : [];

// Use a simple counter for gameId
let lastGameId = 0;

function generateIncrementalGameId() {
  lastGameId += 1;
  return lastGameId.toString();
}

export async function GET() {
  if (WORD_LIST.length === 0) {
    return NextResponse.json({ error: 'No words available.' }, { status: 500 });
  }
  const answer = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  const gameId = generateIncrementalGameId();
  gameStore.set(gameId, { answer, tries: [] });
  return NextResponse.json({ gameId });
}
