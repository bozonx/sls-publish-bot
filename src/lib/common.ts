import {LOG_LEVELS, LogLevel} from '../types/Logger';


export function isPromise(toCheck: any): boolean {
  return toCheck
    && typeof toCheck === 'object'
    && typeof toCheck.then === 'function'
    || false
}

// TODO: remove
export function ignorePromiseError(promise: Promise<any>) {
  promise.catch((e: Error) => {});
}

/**
 * Makes ['info', 'warn', 'error'] if log level is 'info'
 */
export function calcAllowedLogLevels(logLevel: LogLevel): LogLevel[] {
  const currentLevelIndex: number = Object.keys(LOG_LEVELS).indexOf(logLevel)

  return Object.keys(LOG_LEVELS).slice(currentLevelIndex) as LogLevel[]
}
