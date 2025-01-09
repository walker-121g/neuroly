import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/server/db.server";
import { loginSchema } from "@/lib/schemas/auth.schema";
import {
  createToken,
  createRefreshToken,
  checkPassword,
  hashRefreshToken,
} from "@/lib/server/auth.server";
import { handleError } from "@/lib/server/error.server";

import { Logger } from "@/lib/logger";
import { AppError } from "@/lib/errors/app.error";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const { email, password } = await loginSchema.parseAsync(body);

    const user = await prisma.user.findUnique({
      where: {
        email,
        isActive: true,
      },
      include: {
        Credentials: true,
      },
    });

    if (!user) {
      throw AppError.fromMessage(
        "The provided email or password is not correct.",
        401,
      );
    }

    const credentials = user.Credentials[0];
    if (!credentials) {
      throw AppError.fromMessage(
        "The provided email or password is not correct.",
        401,
      );
    }

    const isValid = await checkPassword(password, credentials.password);
    if (!isValid) {
      throw AppError.fromMessage(
        "The provided email or password is not correct.",
        401,
      );
    }

    user.Credentials = [];
    const token = createToken(user);
    const refreshToken = createRefreshToken();

    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: hashRefreshToken(refreshToken),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return NextResponse.json({ token, refreshToken }, { status: 200 });
  } catch (error) {
    Logger.error(error as Error);
    return handleError(error);
  }
};
