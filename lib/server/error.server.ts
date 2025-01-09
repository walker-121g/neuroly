import { NextResponse } from "next/server";
import { z } from "zod";

import { AppError } from "../errors/app.error";

export const handleError = (error: unknown): NextResponse => {
  let message = "Invalid email or password";
  let status = 400;

  if (error instanceof z.ZodError) {
    message = error.errors[0].message;
    status = 422;
  } else if (error instanceof AppError) {
    message = error.message;
    status = error.status;
  } else if (error instanceof Error) {
    message = error.message;
    status = 500;
  }

  return NextResponse.json({ error: message }, { status });
};
