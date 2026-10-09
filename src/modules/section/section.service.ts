import { prisma } from "../../lib/prisma.js";

const getAllSections = async () => {
  const sections = await prisma.section.findMany({
    include: {
      course: true,
      semester: true,
      instructor: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return sections;
};

export const sectionService = {
  getAllSections,
};