/**
 * Logger đơn giản dùng console — phù hợp Vercel serverless (logs tự stream về dashboard).
 * Không dùng winston để tránh nặng cold-start trên serverless.
 */
type LogLevel = "debug" | "info" | "warn" | "error" | "http";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  http: 20,
  info: 30,
  warn: 40,
  error: 50,
};

const minLevel = (process.env.LOG_LEVEL as LogLevel) ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minLevel];
}

function format(level: LogLevel, args: unknown[]): string {
  const ts = new Date().toISOString();
  const msg = args
    .map((a) => (a instanceof Error ? (a.stack ?? a.message) : typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ");
  return `${ts} [${level}] ${msg}`;
}

export const logger = {
  debug: (...args: unknown[]) => shouldLog("debug") && console.debug(format("debug", args)),
  http: (...args: unknown[]) => shouldLog("http") && console.log(format("http", args)),
  info: (...args: unknown[]) => shouldLog("info") && console.log(format("info", args)),
  warn: (...args: unknown[]) => shouldLog("warn") && console.warn(format("warn", args)),
  error: (...args: unknown[]) => shouldLog("error") && console.error(format("error", args)),
};
