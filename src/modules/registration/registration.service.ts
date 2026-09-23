import { prisma } from "../../lib/prisma.js";

const createRegistration = async (data: {
  studentId: number;
  sectionId: number;
}) => {
  const { studentId, sectionId } = data;

  // 1. Check if student exists
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // 2. Check if section exists
  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
  });

  if (!section) {
    throw new Error("Section not found");
  }

  // 3. Check if student is already registered
  const existingRegistration = await prisma.registration.findUnique({
    where: {
      studentId_sectionId: {
        studentId,
        sectionId,
      },
    },
  });

  if (existingRegistration) {
    throw new Error("Student is already registered in this section");
  }

  // 4. Check section capacity
  const registrationCount = await prisma.registration.count({
    where: {
      sectionId,
    },
  });

  if (registrationCount >= section.capacity) {
    throw new Error("Section is full");
  }

  // 5. Create registration
  const registration = await prisma.registration.create({
    data: {
      studentId,
      sectionId,
    },
  });

  return registration;
};

export const registrationService = {
  createRegistration,
};