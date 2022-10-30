export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const LOG_LEVELS: Record<LogLevel, LogLevel> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
}

export interface Logger {
  debug: (msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
  error: (msg: string) => void
}
