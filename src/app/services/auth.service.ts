import crypto from "crypto";
import prisma from "../../shared/prisma";
import { sendInviteEmail, sendLoginCode } from "../../helpers/sendEmail";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { User } from "@prisma/client";
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

const verifyCode = async (email: string, code: string, companyId: string) => {
  const record = await prisma.magicCode.findUnique({ where: { email } });

  if (!record || record.code !== code || record.expires < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired code");
  }

  await prisma.magicCode.delete({ where: { email } });

  let user = await prisma.user.findUnique({ where: { email } });
  let userWithCompany = await prisma.user.findFirst({
    where: {
      email,
      Company: {
        some: {
          id: companyId,
        },
      },
    },
  });

  if (user && !userWithCompany && companyId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        Company: {
          connect: { id: companyId },
        },
      },
    });
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        ...(companyId && {
          Company: {
            connect: { id: companyId },
          },
        }),
      },
    });
  }

  const accessToken = jwtHelpers.createToken(
    { id: user.id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { id: user.id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user,
  };
};

const inviteEmployee = async (emails: string[], companyId: string) => {
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: emails,
      },
      Company: {
        some: {
          id: companyId,
        },
      },
    },
    select: {
      email: true,
    },
  });

  const existingEmails = new Set(existingUsers.map((u) => u.email));

  // 2. Filter out existing emails
  const newEmails = emails.filter((email) => !existingEmails.has(email));
  for (const email of newEmails) {
    sendInviteEmail(email, companyId);
  }

  return {
    invited: newEmails,
    skipped: Array.from(existingEmails),
  };
};

// get user by id
const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      Spaces: {
        include: {
          members: true,
          project: true,
        },
      },
      Project: true,
    },
  });
};

// update user profile
const updateUserProfile = async (
  id: string,
  payload: Partial<User>
): Promise<User> => {
  return prisma.user.update({ where: { id }, data: payload });
};

export const AuthService = {
  requestCode,
  verifyCode,
  inviteEmployee,
  getUserById,
  updateUserProfile,
};
