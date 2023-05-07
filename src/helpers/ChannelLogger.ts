import {calcAllowedLogLevels, LOG_LEVELS, Logger, LogLevel} from 'squidlet-lib';
import System from '../System.js';


export default class ChannelLogger implements Logger {
  private readonly app: System;
  private readonly allowDebug: boolean
  private readonly allowInfo: boolean
  private readonly allowWarn: boolean


  constructor(level: LogLevel, app: System) {
    this.app = app;

    const allowedLogLevels: LogLevel[] = calcAllowedLogLevels(level);

    this.allowDebug = allowedLogLevels.includes(LOG_LEVELS.debug);
    this.allowInfo = allowedLogLevels.includes(LOG_LEVELS.info);
    this.allowWarn = allowedLogLevels.includes(LOG_LEVELS.warn);
  }


  log = async (message: string) => {
    this.app.tg.bot.telegram.sendMessage(
      this.app.appConfig.logChannelId,
      message,
      {
        disable_web_page_preview: true,
        //parse_mode: this.app.appConfig.telegram.parseMode
      }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send LOG message to log channel: ${e}`);
      });
  }

  debug = (message: string) => {
    if (!this.allowDebug) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.appConfig.logChannelId,
      `DEBUG: ${message}`,
      {
        disable_web_page_preview: true,
        //parse_mode: this.app.appConfig.telegram.parseMode
      }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send DEBUG message to log channel: ${e}`);
      });
  }

  info = async (message: string) => {
    if (!this.allowInfo) return

    await this.app.tg.bot.telegram.sendMessage(
      this.app.appConfig.logChannelId,
      `INFO: ${message}`,
      {
        disable_web_page_preview: true,
        //parse_mode: this.app.appConfig.telegram.parseMode
      }
    )
      // TODO: удостовериться что catch после перехвата не сработает в возвращаемом промисе
      .catch((e) => {
        this.app.consoleLog.error(`Can't send INFO message to log channel: ${e}`);
      });
  }

  warn = (message: string) => {
    if (!this.allowWarn) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.appConfig.logChannelId,
      `WARNING: ${message}`,
      {
        disable_web_page_preview: true,
        //parse_mode: this.app.appConfig.telegram.parseMode
      }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send WARNING message to log channel: ${e}`);
      });
  }

  error = (message: string | Error) => {
    this.app.tg.bot.telegram.sendMessage(
      this.app.appConfig.logChannelId,
      `ERROR: ${message}`,
      {
        disable_web_page_preview: true,
        //parse_mode: this.app.appConfig.telegram.parseMode
      }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send ERROR message to log channel: ${e}`);
      });
  }
}
