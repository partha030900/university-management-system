import { prisma } from "../../lib/prisma.js";
import { calculateCourseGrade } from "../../utils/course_grade.js";
import { calculateGPA } from "../../utils/gpa.js";

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

    const gpaResults: {
        credits: number;
        grade: "A_PLUS" | "A" | "A_MINUS" | "B_PLUS" | "B" | "B_MINUS" | "C_PLUS" | "C" | "D" | "F";
    }[] = [];

    const courses = registrations.map((registration) => {
        const midtermResult = registration.results.find(
            (result) => result.exam.type === "MIDTERM"
        );

        

        const finalResult = registration.results.find(
            (result) => result.exam.type === "FINAL"
        );

        let finalMarks: number | null = null;
        let grade = null;

        if (midtermResult && finalResult) {
            const courseGrade = calculateCourseGrade(
                midtermResult.marks,
                finalResult.marks
            );

            finalMarks = courseGrade.finalMarks;
            grade = courseGrade.grade;

            gpaResults.push({
                credits: registration.section.course.credits,
                grade: courseGrade.grade,
            });
        }

        return {
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

            finalMarks,
            grade,
        };
    });

    const cumulativeGPA = calculateGPA(gpaResults);

   return {
  student: {
    id: student.id,
    studentId: student.studentId,
    name: student.name,
  },
  courses,
  cumulativeGPA,
};
};

export const transcriptService = {
    getStudentTranscript
}