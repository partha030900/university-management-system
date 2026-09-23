import type { Grade } from "../../generated/prisma/enums";

export const getGradeFromMarks = (marks: number): Grade => {
  if (marks >= 80) return "A_PLUS";
  if (marks >= 75) return "A";
  if (marks >= 70) return "A_MINUS";
  if (marks >= 65) return "B_PLUS";
  if (marks >= 60) return "B";
  if (marks >= 55) return "B_MINUS";
  if (marks >= 50) return "C_PLUS";
  if (marks >= 45) return "C";
  if (marks >= 40) return "D";

  return "F";
};