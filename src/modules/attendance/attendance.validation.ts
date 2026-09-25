import { z } from "zod";

export const createAttendanceSchema = z.object({
  registrationId: z.number().int().positive(),
  date: z.coerce.date(),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
});