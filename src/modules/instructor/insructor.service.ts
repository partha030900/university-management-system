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

const getMyStudents = async (userId: number) => {
  const instructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  if (!instructor) {
    throw new AppError(404, "Instructor not found");
  }

  const registrations = await prisma.registration.findMany({
    where: {
      section: {
        instructorId: instructor.id,
      },
    },
    include: {
      student: {
        include: {
          program: true,
        },
      },
      section: {
        include: {
          course: true,
        },
      },
    },
    orderBy: {
      registeredAt: "desc",
    },
  });

  return registrations;
};

export const instructorService = {
  getAllInstructorsCount,
  getMySections,
  getMyStudents,
};