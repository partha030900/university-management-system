import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const getAllInstructorsCount = async () => {
  return prisma.instructor.count();
};

const getMySections = async (userId: number) => {
  const instructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  if (!instructor) {
    throw new AppError(404, "Instructor not found");
  }

  return prisma.section.findMany({
    where: { instructorId: instructor.id },
    include: {
      course: true,
      semester: true,
      _count: {
        select: {
          registrations: true,
          exams: true,
        },
      },
    },
  });
};

export const instructorService = {
  getAllInstructorsCount,
  getMySections,
};