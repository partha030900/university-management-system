import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.literal("STUDENT").optional().default("STUDENT"),
});


export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(1),
});