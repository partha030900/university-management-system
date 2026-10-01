import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import config from "../../config/index.js";
import { jwtUtils } from "../../utils/jwt.js";


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

const login = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    }

 const accessToken = jwtUtils.createAccessToken(jwtPayload,config.jwt_access_secret,config.jwt_access_expires_in);

  return {accessToken,
  };
};

export const authService = {
  register,
  login,
};