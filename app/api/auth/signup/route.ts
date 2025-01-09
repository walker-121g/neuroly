import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/server/db.server";
import { signupSchema } from "@/lib/schemas/auth.schema";
import { verifyCsrfToken, hashPassword } from "@/lib/server/auth.server";
import { handleError } from "@/lib/server/error.server";

import { Logger } from "@/lib/logger";
import { AppError } from "@/lib/errors/app.error";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const headers = request.headers;

    const csrfToken = headers.get("x-csrf-token");
    if (!csrfToken || !(await verifyCsrfToken(csrfToken))) {
      throw AppError.fromMessage("An invalid CSRF token was provided.", 403);
    }

    const { email, password, firstName, lastName } =
      await signupSchema.parseAsync(body);

    await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        Credentials: {
          create: {
            password: await hashPassword(password),
          },
        },
      },
    });

    // send email verification

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    Logger.error(error as Error);
    return handleError(error);
  }
};
