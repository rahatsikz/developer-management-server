// server.ts (Express + Prisma)

import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import httpStatus from "http-status";

const requestCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await AuthService.requestCode(email);

    console.log(result);

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Code sent successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code, companyId } = req.body;
    const result = await AuthService.verifyCode(email, code, companyId);

    res.cookie("access_token", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refresh_token", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Welcome to DMS",
      data: result.user,
      // data: null,
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session!.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie("dms.sid", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "You've been logged out successfully.",
      data: null,
    });
  });
};

const inviteEmployee = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { emails, companyId } = req.body;
    const result = AuthService.inviteEmployee(emails, companyId);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Employees invited successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = (req.user as any).id;
    const result = await AuthService.getUserById(id);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req.user as any).id;
    const payload = req.body;
    const updatedUser = await AuthService.updateUserProfile(id, payload);
    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  requestCode,
  verifyCode,
  logout,
  inviteEmployee,
  getProfile,
  updateUserProfile,
};
