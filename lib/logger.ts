export class Logger {
  static log(message: string | Error) {
    console.log(message);
  }

  static warn(message: string | Error) {
    console.warn(message);
  }

  static error(message: string | Error) {
    console.error(message);
  }
}
