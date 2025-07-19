import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwtHelpers.verifyToken(token, config.jwt.secret!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
    return;
  }
};
