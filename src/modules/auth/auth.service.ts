import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import config from "../../config/index.js";
import { jwtUtils } from "../../utils/jwt.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(config.google_client_id);



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

 const refreshToken = jwtUtils.createRefreshToken(jwtPayload,config.jwt_refresh_secret,config.jwt_refresh_expires_in);

  return {accessToken,refreshToken};
  
};

const refreshAccessToken = async (refreshToken: string) => {
  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      config.jwt_refresh_secret
    ) as {
      id: number;
      email: string;
      role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    };
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const accessToken = jwtUtils.createAccessToken(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    },
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

const googleLogin = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.google_client_id,
  });

  const payload = ticket.getPayload();

  if ( !payload ||!payload.email ||payload.email_verified !== true) {
  throw new AppError(401, "Invalidv Google account");
}
  const { email } = payload;

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: "",
        role: "STUDENT",
      },
    });
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createAccessToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  const refreshToken = jwtUtils.createRefreshToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};


export const authService = {
  register,
  login,
  refreshAccessToken,
  googleLogin
}