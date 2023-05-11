import {LogLevel} from 'squidlet-lib';


export interface TgBotConfig {
  isProduction: boolean
  debug: boolean
  logLevel?: LogLevel
}
