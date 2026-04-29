/**
 * Utility to generate a randomized set of questions for a specific subject and level.
 * Ensures no duplicates within a single session.
 */
export const generateQuestionSet = (allQuestions, count = 10) => {
  if (!allQuestions || allQuestions.length === 0) return [];
  
  const pool = [...allQuestions];
  const totalAvailable = pool.length;
  const actualCount = Math.min(count, totalAvailable);
  
  const selectedQuestions = [];
  const usedIndices = new Set();
  
  console.log(`--- Question Generator Started ---`);
  console.log(`Pool size: ${totalAvailable}, Requested: ${actualCount}`);

  while (selectedQuestions.length < actualCount) {
    // Generate a random number (index)
    const randomIndex = Math.floor(Math.random() * totalAvailable);
    
    // Check for duplicates
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      
      // Clone the question to avoid mutating the original data
      const question = { ...pool[randomIndex] };
      
      // Shuffle options for each question so that the answer isn't always at the same position
      if (question.options && Array.isArray(question.options)) {
        const shuffledOptions = [...question.options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        question.options = shuffledOptions;
      }

      selectedQuestions.push(question);
      
      // Log for transparency (can be seen in console)
      console.log(`Generated random index: ${randomIndex + 1} -> Question ID: ${question.id}`);
    }
  }
  
  console.log(`Selected Indices: ${Array.from(usedIndices).map(i => i + 1).join(', ')}`);
  console.log(`--- Question Generator Finished ---`);
  
  return selectedQuestions;
};
