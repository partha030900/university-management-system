import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["MIDTERM", "FINAL"]),
  totalMarks: z.number().positive(),
  sectionId: z.number().int().positive(),
  examDate: z.coerce.date(),
});