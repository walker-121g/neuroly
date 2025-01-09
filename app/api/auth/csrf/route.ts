import { NextResponse } from "next/server";

import { prisma } from "@/lib/server/db.server";
import { createCsrfToken } from "@/lib/server/auth.server";
import { handleError } from "@/lib/server/error.server";

import { Logger } from "@/lib/logger";

export const GET = async (): Promise<NextResponse> => {
  try {
    const token = createCsrfToken();
    await prisma.token.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      },
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    Logger.error(error as Error);
    return handleError(error);
  }
};
