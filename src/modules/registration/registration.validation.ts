import { z } from "zod";

export const createRegistrationSchema = z.object({
  studentId: z.number().int().positive(),
  sectionId: z.number().int().positive(),
});