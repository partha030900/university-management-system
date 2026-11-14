import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["MIDTERM", "FINAL"]),
  totalMarks: z.number().positive(),
  sectionId: z.number().int().positive(),
  examDate: z.coerce.date(),
});

export const updateExamSchema = createExamSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );