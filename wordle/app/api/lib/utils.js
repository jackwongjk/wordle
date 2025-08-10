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
 * @param {string} answer - The target word to guess
 * @returns {GameScore} - Object containing the score and detailed status for each guess
 */
export const getScore = (tries, answer) => {
  const score = { hit: [], present: [], miss: [] };
  const answerLetterList = answer.split('');
  const scoreForEachTry = [];

  tries.forEach((guess) => {
    const hitList = [];
    const presentList = [];
    const missList = [];
    const letterScore = [];

    guess.split('').forEach((letter, index) => {
      const lowerLetter = letter.toLowerCase();

      if (lowerLetter === answerLetterList[index].toLowerCase()) {
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
