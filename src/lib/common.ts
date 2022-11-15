import {LOG_LEVELS, LogLevel} from '../types/Logger';
import _ from 'lodash';


export function isPromise(toCheck: any): boolean {
  return toCheck
    && typeof toCheck === 'object'
    && typeof toCheck.then === 'function'
    || false
}

// export function ignorePromiseError(promise: Promise<any>) {
//   promise.catch((e: Error) => {});
// }

/**
 * Makes ['info', 'warn', 'error'] if log level is 'info'
 */
export function calcAllowedLogLevels(logLevel: LogLevel): LogLevel[] {
  const currentLevelIndex: number = Object.keys(LOG_LEVELS).indexOf(logLevel)

  return Object.keys(LOG_LEVELS).slice(currentLevelIndex) as LogLevel[]
}

export function makeTagsString(tags?: string[]): string {
  if (!tags || !tags.length) return '';

  return tags.map((item) => `#${_.trimStart(_.trim(item), '#')}`).join(' ');
}
