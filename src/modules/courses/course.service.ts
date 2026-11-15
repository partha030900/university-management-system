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


const createCourse = async (data: {
  code: string;
  title: string;
  description?: string;
  credits: number;
  fee: number;
}) => {
  return prisma.course.create({
    data: {
      code: data.code,
      title: data.title,
      description: data.description ?? null,
      credits: data.credits,
      fee: data.fee,
    },
  });
};


export const courseService = {
  getAllCourses,createCourse
};