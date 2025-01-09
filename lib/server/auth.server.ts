import { verify, sign } from "jsonwebtoken";
import { randomBytes, createHash } from "node:crypto";
import { genSalt, hash as hashFunc, compare } from "bcrypt";

import { prisma } from "./db.server";

import { AppError, AppErrorMessages } from "../errors/app.error";
import { Context } from "../types/auth";
import { Logger } from "../logger";

export const createToken = (payload: Context): string => {
  return sign(payload, process.env.AUTH_SECRET!, {
    expiresIn: process.env.AUTH_EXPIRES_IN!,
    subject: process.env.AUTH_SUBJECT!,
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string): Context => {
  try {
    const result = verify(token, process.env.AUTH_SECRET!, {
      subject: process.env.AUTH_SUBJECT!,
      algorithms: ["HS256"],
    });

    return result as Context;
  } catch (error) {
    Logger.log(error as Error);
    throw AppError.fromMessage(AppErrorMessages.UNAUTHORIZED, 401);
  }
};

export const createRefreshToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const hashRefreshToken = (refreshToken: string): string => {
  return createHash("sha256").update(refreshToken).digest("hex");
};

export const verifyRefreshToken = (
  refreshToken: string,
  hash: string,
): boolean => {
  return hashRefreshToken(refreshToken) === hash;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hashFunc(password, salt);
};

export const checkPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await compare(password, hash);
};

export const createCsrfToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const verifyCsrfToken = async (token: string): Promise<boolean> => {
  const tokenEntry = await prisma.token.findFirst({
    where: {
      token,
      isActive: true,
    },
  });

  return tokenEntry !== null;
};

export const clearCsrfTokens = async (): Promise<void> => {
  await prisma.token.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
};
