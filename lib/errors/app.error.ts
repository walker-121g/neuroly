export enum AppErrorMessages {
  INVALID_CREDENTIALS = "Your email or password is incorrect.",
  UNAUTHORIZED = "You cannot access this resource.",
  NOT_FOUND = "The requested resource was not found.",
  INVALID_REQUEST = "The request is invalid.",
  SERVER_ERROR = "An error occurred on the server.",
}

export class AppError extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

  public toJSON() {
    return {
      status: this.status,
      message: this.message,
    };
  }

  public toString() {
    return `${this.status}: ${this.message}`;
  }

  public static fromError(error: Error, status: number) {
    return new AppError(status, error.message);
  }

  public static fromMessage(message: string, status: number) {
    return new AppError(status, message);
  }

  public static fromStatus(status: number) {
    return new AppError(status, "");
  }

  public static fromUnknown() {
    return new AppError(500, "An unknown error occurred.");
  }
}
