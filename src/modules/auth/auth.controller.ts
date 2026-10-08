import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { AppError } from "../../utils/AppError.js";

const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

const login = async (req: Request, res: Response) => {
  const user = await authService.login(req.body);

  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      accessToken: user.accessToken,
    },
  });
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(401, "Refresh token required");
  }

  const result = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: result,
  });
};

const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logout successful",
    data: {},
  });
};

const googleLogin = async (req: Request, res: Response) => {
  const user = await authService.googleLogin(req.body.idToken);

  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Google login successful",
    data: {
      accessToken: user.accessToken,
    },
  });
};

export const authController = {
  register,
  login,
  refreshAccessToken,logout,googleLogin
};