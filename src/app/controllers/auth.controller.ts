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
    const { email, code } = req.body;
    const result = await AuthService.verifyCode(email, code);

    res.cookie("SESSION", result, { httpOnly: true, secure: true });

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      success: true,
      message: "Welcome to DMS",
      // data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = { requestCode, verifyCode };
