import crypto from "crypto";
import prisma from "../../shared/prisma";
import { sendLoginCode } from "../../helpers/sendEmail";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
const requestCode = async (email: string) => {
  const code = crypto.randomBytes(3).toString("hex");
  const expires = new Date(Date.now() + 5 * 60_000);

  const result = await prisma.magicCode.upsert({
    where: { email },
    update: { code, expires },
    create: { email, code, expires },
  });

  await sendLoginCode(email, code);

  return result;
};

const verifyCode = async (email: string, code: string) => {
  const record = await prisma.magicCode.findUnique({ where: { email } });

  if (!record || record.code !== code || record.expires < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired code");
  }

  await prisma.magicCode.delete({ where: { email } });

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email } });
  }

  const token = jwtHelpers.createToken(
    { id: user.id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return token;
};

export const AuthService = { requestCode, verifyCode };
