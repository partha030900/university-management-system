import { prisma } from "../../lib/prisma.js";

const getStudentTranscript = async (studentId: number) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const registrations = await prisma.registration.findMany({
    where: {
      studentId,
    },
    include: {
      section: {
        include: {
          course: true,
          semester: true,
        },
      },
      results: {
        include: {
          exam: true,
        },
      },
    },
    orderBy: {
      registeredAt: "asc",
    },
  });

  return {
    student: {
      id: student.id,
      studentId: student.studentId,
      name: student.name,
    },
    courses: registrations.map((registration) => ({
      registrationId: registration.id,
      course: {
        code: registration.section.course.code,
        title: registration.section.course.title,
        credits: registration.section.course.credits,
      },
      semester: {
        name: registration.section.semester.name,
        year: registration.section.semester.year,
      },
      results: registration.results.map((result) => ({
        examType: result.exam.type,
        marks: result.marks,
        grade: result.grade,
      })),
    })),
  };
};

export const transcriptService = {
  getStudentTranscript,
};