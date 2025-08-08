import Image from 'next/image';
import Keyboard from '@/components/keyboard';
import WordleBody from './wordle-body';

const WORDS = process.env.WORDS;
const MAX_TRIES = process.env.MAX_TRIES
  ? parseInt(process.env.MAX_TRIES, 10)
  : 6;

export const metadata = {
  title: 'Wordle',
  description: `Guess the word in ${MAX_TRIES} tries!`,
};

export default function Home() {
  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col items-center sm:items-start w-full">
        <WordleBody words={WORDS} maxTries={MAX_TRIES} />
      </main>
    </div>
  );
}
