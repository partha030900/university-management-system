export const calculateFinalMarks = (
  midtermMarks: number,
  finalMarks: number
): number => {
  const finalScore = midtermMarks * 0.4 + finalMarks * 0.6;

  return Number(finalScore.toFixed(2));
};