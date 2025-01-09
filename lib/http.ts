import { useAuth } from "@/hooks/useAuth";
import { AppError } from "./errors/app.error";

export const request = async <T>({
  path,
  method,
  headers,
  body,
  authed,
  preventRetry,
}: {
  path: `/${string}`;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  authed?: boolean;
  preventRetry?: boolean;
}): Promise<T> => {
  try {
    const requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/json");
    requestHeaders.append("Accept", "application/json");

    if (authed) {
      requestHeaders.append(
        "Authorization",
        `Bearer ${useAuth.getState().token}`,
      );
    }

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        requestHeaders.append(key, value);
      });
    }

    const response = await fetch(path, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 200) {
      return (await response.json()) as T;
    } else {
      const errorObject = await response.json();
      if (errorObject) {
        throw AppError.fromMessage(errorObject.error, response.status);
      } else {
        throw AppError.fromMessage(
          "An unknown error occurred",
          response.status,
        );
      }
    }
  } catch (error) {
    if (error instanceof AppError) {
      if (error.status === 401 && authed && !preventRetry) {
        return await request<T>({
          path,
          method,
          headers,
          body,
          authed,
          preventRetry: true,
        });
      }

      throw error;
    } else {
      throw AppError.fromMessage("An unknown error occurred", 500);
    }
  }
};
