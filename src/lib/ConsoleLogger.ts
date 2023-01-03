import {LOG_LEVELS, Logger, LogLevel} from '../types/Logger.js';
import {calcAllowedLogLevels} from './common.js';


export default class ConsoleLogger implements Logger {
  private readonly allowDebug: boolean
  private readonly allowInfo: boolean
  private readonly allowWarn: boolean


  constructor(level: LogLevel) {
    const allowedLogLevels: LogLevel[] = calcAllowedLogLevels(level)

    this.allowDebug = allowedLogLevels.includes(LOG_LEVELS.debug);
    this.allowInfo = allowedLogLevels.includes(LOG_LEVELS.info);
    this.allowWarn = allowedLogLevels.includes(LOG_LEVELS.warn);
  }


  debug = (message: string) => {
    if (!this.allowDebug) return

    console.info(`DEBUG: ${message}`)
  }

  info = (message: string) => {
    if (!this.allowInfo) return

    console.info(`INFO: ${message}`)
  }

  warn = (message: string) => {
    if (!this.allowWarn) return

    console.warn(`WARNING: ${message}`)
  }

  error = (message: string | Error) => {
    console.error(`ERROR: ${message}`)
  }

}
