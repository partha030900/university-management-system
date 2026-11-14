import { prisma } from "../../lib/prisma.js";
import { calculateGPA } from "../../utils/gpa.js";
import { calculateCourseGrade } from "../../utils/course_grade.js";
import { getGradeFromMarks } from "../../utils/grade.js";

const getStudentResults = async (studentId: number) => {
  const results = await prisma.result.findMany({
    where: {
      registration: {
        studentId,
      },
    },
    include: {
      exam: true,
      registration: {
        include: {
          section: {
            include: {
              course: true,
              semester: true,
            },
          },
        },
      },
    },
  });

  return results;
};

const getStudentGPA = async (studentId: number) => {
  const results = await getStudentResults(studentId);

  const courseResults = new Map<
    number,
    {
      credits: number;
      midtermMarks: number | null;
      finalMarks: number | null;
    }
  >();

  for (const result of results) {
    const course = result.registration.section.course;

    if (!courseResults.has(course.id)) {
      courseResults.set(course.id, {
        credits: course.credits,
        midtermMarks: null,
        finalMarks: null,
      });
    }

    const courseResult = courseResults.get(course.id)!;

    if (result.exam.type === "MIDTERM") {
      courseResult.midtermMarks = result.marks;
    }

    if (result.exam.type === "FINAL") {
      courseResult.finalMarks = result.marks;
    }
  }

  const finalCourseResults = [];

  for (const course of courseResults.values()) {
    if (course.midtermMarks === null || course.finalMarks === null) {
      continue;
    }

    const finalResult = calculateCourseGrade(
      course.midtermMarks,
      course.finalMarks
    );

    finalCourseResults.push({
      credits: course.credits,
      grade: finalResult.grade,
    });
  }

  return calculateGPA(finalCourseResults);
};

const getExamStudents = async (
  examId: number,
  userId: number,
  userRole: string
) => {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      section: true,
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  if (userRole === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new Error("Instructor profile not found");
    }

    if (exam.section.instructorId !== instructor.id) {
      throw new Error(
        "You do not have permission to view students for this exam"
      );
    }
  }

  const registrations = await prisma.registration.findMany({
    where: {
      sectionId: exam.sectionId,
    },
    include: {
      student: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      results: {
        where: {
          examId,
        },
      },
    },
  });

  return {
    exam,
    students: registrations.map((registration) => ({
      registrationId: registration.id,
      studentId: registration.student.studentId,
      name: registration.student.name,
      email: registration.student.user.email,
      result: registration.results[0] ?? null,
    })),
  };
};


const getExamPerformance = async (
  examId: number,
  userId: number,
  userRole: string
) => {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      section: true,
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Check instructor ownership.
  if (userRole === "INSTRUCTOR") {
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new Error("Instructor profile not found");
    }

    if (exam.section.instructorId !== instructor.id) {
      throw new Error(
        "You do not have permission to view this exam's performance"
      );
    }
  }

  const results = await prisma.result.findMany({
    where: {
      examId,
    },
  });

  const totalStudents = await prisma.registration.count({
    where: {
      sectionId: exam.sectionId,
    },
  });

  const marks = results.map((result) => result.marks);

  const passedStudents = marks.filter((mark) => mark >= 40).length;
  const failedStudents = marks.filter((mark) => mark < 40).length;

  const averageMarks =
    marks.length > 0
      ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length
      : 0;

  return {
    exam,
    totalStudents,
    studentsGraded: marks.length,
    studentsNotGraded: totalStudents - marks.length,
    averageMarks: Number(averageMarks.toFixed(2)),
    passedStudents,
    failedStudents,
    highestMarks: marks.length > 0 ? Math.max(...marks) : null,
    lowestMarks: marks.length > 0 ? Math.min(...marks) : null,
  };
};



const createResult = async (
  data: {
    registrationId: number;
    examId: number;
    marks: number;
  },
  userId: number,
  userRole: string
) => {
  const { registrationId, examId, marks } = data;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      section: true,
    },
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      section: true,
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // The student must be registered in the exam's section.
  if (registration.sectionId !== exam.sectionId) {
    throw new Error(
      "This student is not registered in the exam's section"
    );
  }

  // Instructors can enter results only for their own sections.
if (userRole === "INSTRUCTOR") {
  const instructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  if (!instructor) {
    throw new Error("Instructor profile not found");
  }

  if (exam.section.instructorId !== instructor.id) {
    throw new Error(
      "You do not have permission to enter results for this section"
    );
  }
}


  // Marks cannot exceed the exam's maximum marks.
  if (marks > exam.totalMarks) {
    throw new Error(
      `Marks cannot exceed ${exam.totalMarks}`
    );
  }

  const grade = getGradeFromMarks(marks);

  const result = await prisma.result.upsert({
  where: {
    registrationId_examId: {
      registrationId,
      examId,
    },
  },
  update: {
    marks,
    grade,
  },
  create: {
    registrationId,
    examId,
    marks,
    grade,
  },
});

  return result;
};


export const resultService = {
  getStudentResults,
  getStudentGPA,
  getExamStudents,
  getExamPerformance,
  createResult,
};