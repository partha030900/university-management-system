import { z } from "zod";

export const createStudentSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  studentId: z.string().min(1),
  name: z.string().min(1),
  programId: z.number().int().positive(),
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
});

export const createMyStudentProfileSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().min(1),
  programId: z.number().int().positive(),
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
});