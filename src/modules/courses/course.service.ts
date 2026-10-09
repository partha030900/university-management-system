import { prisma } from "../../lib/prisma.js";

const getAllCourses = async () => {
  return prisma.course.findMany({
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      credits: true,
      prerequisites: {
        select: {
          id: true,
          code: true,
          title: true,
        },
      },
    },
  });
};

export const courseService = {
  getAllCourses,
};