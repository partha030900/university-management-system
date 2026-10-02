import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const createExam = async (
  data: {
    title: string;
    type: "MIDTERM" | "FINAL";
    totalMarks: number;
    sectionId: number;
    examDate: Date;
  },
  userId: number,
  userRole: string
)  => {
  const { title, type, totalMarks, sectionId, examDate } = data;

 const section = await prisma.section.findUnique({
  where: { id: sectionId },
});

if (!section) {
  throw new AppError(404, "Section not found");
}

if (userRole === "INSTRUCTOR") {
  const instructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  if (!instructor || section.instructorId !== instructor.id) {
    throw new AppError(
      403,
      "You can only create exams for your own sections"
    );
  }
}
  

  const existingExam = await prisma.exam.findUnique({
  where: {
    sectionId_type: {
      sectionId,
      type,
    },
  },
});

if (existingExam) {
  throw new Error(`A ${type} exam already exists for this section`);
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
