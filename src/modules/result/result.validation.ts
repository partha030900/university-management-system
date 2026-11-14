import { z } from "zod";

export const createResultSchema = z.object({
  registrationId: z.number().int().positive(),
  examId: z.number().int().positive(),
  marks: z.number().finite().min(0),
});
