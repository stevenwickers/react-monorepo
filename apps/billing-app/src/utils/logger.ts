// logger.ts
export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export type Transport = (entry: {
  time: string;
  level: LogLevel;
  app?: string;
  context?: string;
  message: string;
  data?: unknown;
}) => void | Promise<void>;

export interface LoggerOptions {
  app?: string; // app name tag
  context?: string; // feature/component tag
  level?: LogLevel; // minimum level to emit
  transport?: Transport; // optional: send entries elsewhere
}

const rank: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 99,
};

function prefix(ts: string, app?: string, ctx?: string, lvl?: LogLevel) {
  return [
    `[${ts}]`,
    app && `[${app}]`,
    ctx && `[${ctx}]`,
    lvl && `[${lvl.toUpperCase()}]`,
  ]
    .filter(Boolean)
    .join(" ");
}

export function createLogger(options: LoggerOptions = {}) {
  let currentLevel: LogLevel = options.level ?? "info";
  const send = options.transport;

  const emit = (level: LogLevel, message: string, data?: unknown) => {
    if (rank[level] < rank[currentLevel]) return;

    const time = new Date().toISOString();
    const p = prefix(time, options.app, options.context, level);
    const method = level === "debug" ? "log" : level;

    if (data !== undefined) (console as any)[method](`${p} ${message}`, data);
    else (console as any)[method](`${p} ${message}`);
    return {
      time,
      level,
      app: options.app,
      context: options.context,
      message,
      data,
    };
    //send?.({ time, level, app: options.app, context: options.context, message, data })
  };

  return {
    setLevel: (level: LogLevel) => {
      currentLevel = level;
    },
    getLevel: () => currentLevel,
    child: (extra: Partial<LoggerOptions>) =>
      createLogger({ ...options, ...extra, level: currentLevel }),

    debug: (msg: string, data?: unknown) => emit("debug", msg, data),
    info: (msg: string, data?: unknown) => emit("info", msg, data),
    warn: (msg: string, data?: unknown) => emit("warn", msg, data),
    error: (msg: string, data?: unknown) => emit("error", msg, data),
  };
}

// Optional app-wide singleton (import this everywhere)
export const logger = createLogger({ app: "MyApp", level: "info" });
