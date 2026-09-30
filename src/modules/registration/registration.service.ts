import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const createRegistration = async (data: {
  studentId: number;
  sectionId: number;
}) => {
  const { studentId, sectionId } = data;

  const registration = await prisma.$transaction(async (tx) => {

    const student = await tx.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new AppError(404, "Student not found");
    }


    const section = await tx.section.findUnique({
      where: {
        id: sectionId,
      },
      include: {
        course: {
          include: {
            prerequisites: true,
          },
        },
      },
    });

    if (!section) {
      throw new AppError(404, "Section not found");
    }


    const prerequisites = section.course.prerequisites;

    for (const prerequisite of prerequisites) {
      const completedPrerequisite = await tx.registration.findFirst({
        where: {
          studentId,
          section: {
            courseId: prerequisite.id,
          },
          results: {
            some: {
              grade: {
                not: "F",
              },
            },
          },
        },
      });

      if (!completedPrerequisite) {
        throw new AppError( 400,`Prerequisite course ${prerequisite.code} has not been completed`);
      }
    }


    const existingRegistration = await tx.registration.findUnique({
      where: {
        studentId_sectionId: {
          studentId,
          sectionId,
        },
      },
    });

    if (existingRegistration) {
      throw new AppError(409,"Student is already registered in this section")
    }


    const registrationCount = await tx.registration.count({
      where: {
        sectionId,
      },
    });

    if (registrationCount >= section.capacity) {
      throw new AppError(409, "Section is full");
    }


    return tx.registration.create({
      data: {
        studentId,
        sectionId,
      },
    });
  });

  return registration;
};

export const registrationService = {
  createRegistration,
};