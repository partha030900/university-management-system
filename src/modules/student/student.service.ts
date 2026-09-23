import { prisma } from "../../lib/prisma.js";

const createStudent = async (data: {
  userId: number;
  studentId: string;
  name: string;
  programId: number;
  dateOfBirth?: Date;
  phone?: string;
}) => {
  const { userId, studentId, name, programId, dateOfBirth, phone } = data;

  // 1. Check if the user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Check if the program exists
  const program = await prisma.program.findUnique({
    where: {
      id: programId,
    },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  // 3. Check if this user already has a student profile
  const existingStudent = await prisma.student.findUnique({
    where: {
      userId,
    },
  });

  if (existingStudent) {
    throw new Error("Student profile already exists for this user");
  }

  // 4. Create student
  const student = await prisma.student.create({
  data: {
    userId,
    studentId,
    name,
    programId,
    ...(dateOfBirth !== undefined && { dateOfBirth }),
    ...(phone !== undefined && { phone }),
  },
});

  return student;
};

export const studentService = {
  createStudent,
};