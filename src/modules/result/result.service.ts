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

const createResult = async (data: {
  registrationId: number;
  examId: number;
  marks: number;
}) => {
  const { registrationId, examId, marks } = data;

  // Check if registration exists
  const registration = await prisma.registration.findUnique({
    where: {
      id: registrationId,
    },
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  // Check if exam exists
  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Calculate grade from marks
  const grade = getGradeFromMarks(marks);

  // Create result
  const result = await prisma.result.create({
    data: {
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
  createResult
};