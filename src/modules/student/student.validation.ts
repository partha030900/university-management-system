import { z } from "zod";

export const createStudentSchema = z.object({
  userId: z.number().int().positive(),
  studentId: z.string().min(1),
  name: z.string().min(1),
  programId: z.number().int().positive(),
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
});