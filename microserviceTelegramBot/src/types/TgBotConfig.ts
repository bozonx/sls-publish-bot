import {LogLevel} from 'squidlet-lib';


export interface TgBotConfig {
  isProduction: boolean
  debug: boolean
  logLevel: LogLevel
  // storage for files which been updated rarely
  longStoragePath: string
  // storage for files which updates often
  varStoragePath: string
}
