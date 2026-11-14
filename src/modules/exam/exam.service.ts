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

const getMyExams = async (
  userId: number,
  userRole: string
) => {
  if (userRole === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new AppError(404, "Instructor not found");
    }

    return prisma.exam.findMany({
      where: {
        section: {
          instructorId: instructor.id,
        },
      },
      include: {
        section: {
          include: {
            course: true,
            semester: true,
          },
        },
      },
      orderBy: {
        examDate: "asc",
      },
    });
  }

  return prisma.exam.findMany({
    include: {
      section: {
        include: {
          course: true,
          semester: true,
        },
      },
    },
    orderBy: {
      examDate: "asc",
    },
  });
};

const updateExam = async (
  examId: number,
  data: {
    title?: string;
    type?: "MIDTERM" | "FINAL";
    totalMarks?: number;
    sectionId?: number;
    examDate?: Date;
  },
  userId: number,
  userRole: string
) => {
  const existingExam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { section: true },
  });

  if (!existingExam) {
    throw new AppError(404, "Exam not found");
  }

  if (userRole === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor || existingExam.section.instructorId !== instructor.id) {
      throw new AppError(403, "You cannot update this exam");
    }
  }

  const newSectionId = data.sectionId ?? existingExam.sectionId;
  const newType = data.type ?? existingExam.type;

  const section = await prisma.section.findUnique({
    where: { id: newSectionId },
  });

  if (!section) {
    throw new AppError(404, "Section not found");
  }

  if (userRole === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor || section.instructorId !== instructor.id) {
      throw new AppError(403, "You cannot assign an exam to this section");
    }
  }

  const duplicateExam = await prisma.exam.findUnique({
    where: {
      sectionId_type: {
        sectionId: newSectionId,
        type: newType,
      },
    },
  });

  if (duplicateExam && duplicateExam.id !== examId) {
    throw new AppError(400, "An exam of this type already exists for this section");
  }

  return prisma.exam.update({
    where: { id: examId },
    data,
  });
};

const deleteExam = async (
  examId: number,
  userId: number,
  userRole: string
) => {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { section: true },
  });

  if (!exam) {
    throw new AppError(404, "Exam not found");
  }

  if (userRole === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor || exam.section.instructorId !== instructor.id) {
      throw new AppError(403, "You cannot delete this exam");
    }
  }

  await prisma.$transaction([
    prisma.result.deleteMany({
      where: { examId },
    }),
    prisma.exam.delete({
      where: { id: examId },
    }),
  ]);

  return exam;
};

export const examService = {
  createExam,
  getMyExams,
  updateExam,
  deleteExam,
};