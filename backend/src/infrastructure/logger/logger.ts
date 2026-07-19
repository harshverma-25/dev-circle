export class Logger {
  static info(message: string, ...meta: any[]): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...meta);
  }

  static warn(message: string, ...meta: any[]): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...meta);
  }

  static error(message: string, error?: any, ...meta: any[]): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || "", ...meta);
  }

  static debug(message: string, ...meta: any[]): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...meta);
    }
  }
}
