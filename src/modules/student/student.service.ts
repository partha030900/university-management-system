import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from "bcryptjs";

const createStudent = async (data: {
  email: string;
  password: string;
  studentId: string;
  name: string;
  programId: number;
  dateOfBirth?: Date;
  phone?: string;
}) => {
  const {
    email,
    password,
    studentId,
    name,
    programId,
    dateOfBirth,
    phone,
  } = data;

  // Check whether email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  // Check whether program exists
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    throw new AppError(404, "Program not found");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User and Student together
  const student = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    return tx.student.create({
      data: {
        userId: user.id,
        studentId,
        name,
        programId,
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(phone !== undefined && { phone }),
      },
      include: {
        program: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  });

  return student;
};

const createMyStudentProfile = async (
  userId: number,
  data: {
    studentId: string;
    name: string;
    programId: number;
    dateOfBirth?: Date;
    phone?: string;
  }
) => {
  const existingStudent = await prisma.student.findUnique({
    where: { userId },
  });

  if (existingStudent) {
    throw new AppError(409, "Student profile already exists");
  }

  const program = await prisma.program.findUnique({
    where: { id: data.programId },
  });

  if (!program) {
    throw new AppError(404, "Program not found");
  }

  return prisma.student.create({
    data: {
      userId,
      ...data,
    },
    include: {
      program: true,
    },
  });
};

const getMyStudentProfile = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: {
      userId,
    },
    include: {
      program: true,
    },
  });

  if (!student) {
  throw new AppError(404, "Student profile not found");
}


  return student;
};

const getStudentById = async (id: number) => {
  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      program: true,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};

const getAllStudents = async () => {
  return prisma.student.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      program: true,
    },
  });
};

const getAllPrograms = async () => {
  return prisma.program.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const studentService = {
  createStudent,createMyStudentProfile,getMyStudentProfile,getStudentById,getAllStudents,getAllPrograms
};