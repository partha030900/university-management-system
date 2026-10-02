import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  registrationId: z.coerce.number().int().positive(),
});