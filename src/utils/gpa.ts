import type { Grade } from "../../generated/prisma/enums";
import { getGradePoint } from "./grade_point";


type CourseResult = {
  credits: number;
  grade: Grade;
};

export const calculateGPA = (results: CourseResult[]): number => {
  if (results.length === 0) {
    return 0;
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const result of results) {
    const gradePoint = getGradePoint(result.grade);

    totalQualityPoints += result.credits * gradePoint;
    totalCredits += result.credits;
  }

  return Number((totalQualityPoints / totalCredits).toFixed(2));
};