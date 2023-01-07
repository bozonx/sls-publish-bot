import {LOG_LEVELS, LogLevel} from '../types/Logger.js';
import _ from 'lodash';
import moment from 'moment';


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

// TODO: доработать - см либу валидации
export function isValidUrl(url?: string): boolean {
  if (!url) return false

  return Boolean(String(url).match(/^(https?|ftp)\:\/\//));
}

/**
 * Calculate seconds from now to specified date.
 * The number can be less than 0!
 */
export function calcSecondsToDate(toDateStr: string, utcOffset: number): number {
  const now = moment().utcOffset(utcOffset);
  const toDate = moment(toDateStr).utcOffset(utcOffset);

  return toDate.unix() - now.unix();
}

export function validateTime(rawStr: string) {
  if (
    rawStr.indexOf(':') < 0
    || !moment(`2022-01-01T${rawStr}`).isValid()
  ) {
    throw new Error(`Incorrect time`);
  }
}
