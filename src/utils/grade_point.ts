import type { Grade } from "../../generated/prisma/enums";



const gradePointMap: Record<Grade, number> = {
  A_PLUS: 4.0,
  A: 3.75,
  A_MINUS: 3.5,
  B_PLUS: 3.25,
  B: 3.0,
  B_MINUS: 2.75,
  C_PLUS: 2.5,
  C: 2.25,
  D: 2.0,
  F: 0.0,
};

export const getGradePoint = (grade: Grade): number => {
  return gradePointMap[grade];
};