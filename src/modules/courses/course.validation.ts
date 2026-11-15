
import { z } from "zod";

export const createCourseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  title: z.string().min(1, "Course title is required"),
  description: z.string().optional(),
  credits: z.number().positive("Credits must be greater than zero"),
  fee: z.number().positive("Course fee must be greater than zero"),
});
