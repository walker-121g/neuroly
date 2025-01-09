import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/server/db.server";
import { refreshSchema } from "@/lib/schemas/auth.schema";
import {
  createToken,
  createRefreshToken,
  hashRefreshToken,
} from "@/lib/server/auth.server";
import { handleError } from "@/lib/server/error.server";

import { Logger } from "@/lib/logger";
import { AppError } from "@/lib/errors/app.error";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const { id, refreshToken } = await refreshSchema.parseAsync(body);

    const hashedToken = hashRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        Sessions: {
          where: {
            token: hashedToken,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      throw AppError.fromMessage(
        "There is no active session for the provided user.",
        401,
      );
    }

    const session = user.Sessions[0];
    if (!session) {
      throw AppError.fromMessage("The provided refreshToken is invalid.", 401);
    }

    const newRefreshToken = createRefreshToken();
    await prisma.userSession.update({
      where: {
        id: session.id,
      },
      data: {
        isActive: true,
        token: hashRefreshToken(newRefreshToken),
      },
    });

    user.Sessions = [];

    const newToken = createToken(user);

    return NextResponse.json(
      { token: newToken, refreshToken: newRefreshToken },
      { status: 200 },
    );
  } catch (error) {
    Logger.error(error as Error);
    return handleError(error);
  }
};
