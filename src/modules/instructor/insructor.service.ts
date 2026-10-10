import { prisma } from "../../lib/prisma.js";

const getAllInstructorsCount = async () => {
  return prisma.instructor.count();
};

export const instructorService = {
  getAllInstructorsCount,
};