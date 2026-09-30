import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

const register = async (data: {
  email: string;
  password: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}) => {
  const { email, password, role } = data;

  // Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);

  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const authService = {
  register,
};