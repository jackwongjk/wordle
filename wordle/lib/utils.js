import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const LETTER_COUNT = 5;

export const LETTER_REVEAL_DELAY = 240; // milliseconds

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
  LOADING: 'loading',
};
