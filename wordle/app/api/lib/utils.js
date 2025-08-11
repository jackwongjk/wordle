/**
 * @typedef {Object} GameScore
 * @property {Object} score - Object containing arrays of hit, present, and miss characters
 * @property {string[]} score.hit - Array of characters that are correct and in right position
 * @property {string[]} score.present - Array of characters that exist but in wrong position
 * @property {string[]} score.miss - Array of characters that don't exist in the target word
 * @property {('hit'|'present'|'miss')[][]} scoreForEachTry - Array of arrays containing status for each character attempt
 */

/**
 * This function calculates the score for each guess against the target word.
 * It returns an object with arrays for hit, present, and miss characters,
 * as well as a detailed score for each try.
 * @param {string[]} tries - Array of guessed words
 * @param {string|null} answer - The target word to guess
 * @returns {GameScore} - Object containing the score and detailed status for each guess
 */
export const getScore = (tries, answer) => {
  const score = { hit: [], present: [], miss: [] };
  const answerLetterList = answer
    ? answer.toLowerCase().split('')
    : [null, null, null, null, null];
  const scoreForEachTry = [];

  tries.forEach((guess) => {
    const hitList = [];
    const presentList = [];
    const missList = [];
    const letterScore = [];

    guess.split('').forEach((letter, index) => {
      const lowerLetter = letter.toLowerCase();

      if (lowerLetter === answerLetterList[index]) {
        letterScore.push('hit');
        if (!hitList.includes(lowerLetter)) {
          hitList.push(lowerLetter);
        }
      } else if (answerLetterList.includes(lowerLetter)) {
        letterScore.push('present');
        if (!presentList.includes(lowerLetter)) {
          presentList.push(lowerLetter);
        }
      } else {
        letterScore.push('miss');
        missList.push(lowerLetter);
      }
    });

    scoreForEachTry.push(letterScore);

    score.hit.push(...hitList);
    score.present.push(...presentList);
    score.miss.push(...missList);
  });

  // Remove duplicates
  score.hit = [...new Set(score.hit)];
  score.present = [
    // Remove already hit letters from present
    ...new Set(score.present.filter((l) => !score.hit.includes(l))),
  ];
  score.miss = [
    ...new Set(
      score.miss.filter(
        // Remove already hit and present letters from miss
        (l) => !score.hit.includes(l) && !score.present.includes(l),
      ),
    ),
  ];
  return { score, scoreForEachTry };
};

/**
 * @typedef {Object} ScoreObject
 * @property {number} hits - Count of characters that are correct and in the right position
 * @property {number} presents - Count of characters that are correct but in the wrong position
 */

/**
 * This function calculates the score for a guess against a target word.
 * @param {string} guess - The guessed word
 * @param {string} target - The target word to guess
 * @returns {ScoreObject} - An object containing the counts of hits and presents
 */
function calculateScore(guess, target) {
  let hits = 0;
  let presents = 0;

  const guessLetters = guess.split('');

  guessLetters.forEach((char, index) => {
    switch (true) {
      // Count hits (exact matches)
      case char === target[index]:
        hits++;
        break;
      // Count presents (correct letter, wrong position)
      case target.includes(char):
        presents++;
        break;
      default:
        // Do nothing for misses
        break;
    }
  });

  return { hits, presents };
}

/**
 * This function finds available words based on user inputs and a word list.
 * It filters the word list based on the scores of previous inputs.
 * @param {string[]} inputList - List of previously guessed words
 * @param {*} wordList - The list of words to filter from
 * @returns {string[]} - The filtered list of available words
 */
export function findAvailableWords(inputList, wordList) {
  let remainingWords = [...wordList];

  for (let input of inputList) {
    if (remainingWords.length === 1) {
      return remainingWords;
    }

    let scores = new Map();
    // Calculate scores for each remaining word
    for (let word of remainingWords) {
      const score = calculateScore(input, word);
      scores.set(word, score);
    }
    // Filter out words that do not match the input
    const wordsNotMatchInput = Array.from(scores.entries())
      .filter(([_, v]) => v.hits === 0 && v.presents === 0)
      .map(([word, _]) => word);

    remainingWords = wordsNotMatchInput;
    if (wordsNotMatchInput.length > 0) {
      continue;
    }

    // If all words match the input, find the one with minimum hits
    let minHits = Math.min(...Array.from(scores.values()).map((v) => v.hits));
    let wordsWithMinHits = Array.from(scores.entries()).filter(
      ([_, v]) => v.hits === minHits,
    );
    remainingWords = wordsWithMinHits.map(([word, _]) => word);

    // If multiple words have same minimum hits, take the one with minimum presents
    const remainWordsWithZeroHits = wordsWithMinHits.filter(
      ([_, v]) => v.hits === 0,
    );
    if (remainWordsWithZeroHits.length > 0) {
      // Find the minimum presents among the remaining words with zero hits
      let minPresents = Math.min(
        ...remainWordsWithZeroHits.map(([_, v]) => v.presents),
      );
      let wordsWithMinPresents = remainWordsWithZeroHits.filter(
        ([_, v]) => v.presents === minPresents,
      );
      remainingWords = wordsWithMinPresents.map(([word, _]) => word);

      // If multiple words have same minimum score, take the first one
      if (remainingWords.length > 1) {
        remainingWords = [remainingWords[0]];
      }
    }
  }
  return remainingWords;
}
