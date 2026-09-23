import { calculateFinalMarks } from "./final_marks.js";
import { getGradeFromMarks } from "./grade.js";

export const calculateCourseGrade = (
  midtermMarks: number,
  finalMarks: number
) => {
  const finalMarksValue = calculateFinalMarks(
    midtermMarks,
    finalMarks
  );

  const grade = getGradeFromMarks(finalMarksValue);

  return {
    finalMarks: finalMarksValue,
    grade,
  };
};