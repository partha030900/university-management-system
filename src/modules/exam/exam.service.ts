import { prisma } from "../../lib/prisma.js";

const createExam = async (data: {
  title: string;
  type: "MIDTERM" | "FINAL";
  totalMarks: number;
  sectionId: number;
  examDate: Date;
}) => {
  const { title, type, totalMarks, sectionId, examDate } = data;

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) {
    throw new Error("Section not found");
  }

  const exam = await prisma.exam.create({
    data: {
      title,
      type,
      totalMarks,
      sectionId,
      examDate,
    },
  });

  return exam;
};

export const examService = {
  createExam,
};
