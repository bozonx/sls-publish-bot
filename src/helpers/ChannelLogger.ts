import {LOG_LEVELS, Logger, LogLevel} from '../types/Logger';
import App from '../App';
import {calcAllowedLogLevels} from '../lib/common';


export default class ChannelLogger implements Logger {
  private readonly app: App;
  private readonly allowDebug: boolean
  private readonly allowInfo: boolean
  private readonly allowWarn: boolean


  constructor(level: LogLevel, app: App) {
    this.app = app;

    const allowedLogLevels: LogLevel[] = calcAllowedLogLevels(level);

    this.allowDebug = allowedLogLevels.includes(LOG_LEVELS.debug);
    this.allowInfo = allowedLogLevels.includes(LOG_LEVELS.info);
    this.allowWarn = allowedLogLevels.includes(LOG_LEVELS.warn);
  }


  debug = (message: string) => {
    if (!this.allowDebug) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `DEBUG: ${message}`,
      { parse_mode: this.app.appConfig.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send DEBUG message to log channel: ${e}`);
      });
  }

  info = async (message: string) => {
    if (!this.allowInfo) return

    await this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `INFO: ${message}`,
      { parse_mode: this.app.appConfig.telegram.parseMode }
    )
      // TODO: удостовериться что catch после перехвата не сработает в возвращаемом промисе
      .catch((e) => {
        this.app.consoleLog.error(`Can't send INFO message to log channel: ${e}`);
      });
  }

  warn = (message: string) => {
    if (!this.allowWarn) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `WARNING: ${message}`,
      { parse_mode: this.app.appConfig.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send WARNING message to log channel: ${e}`);
      });
  }

  error = (message: string | Error) => {
    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `ERROR: ${message}`,
      { parse_mode: this.app.appConfig.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLog.error(`Can't send ERROR message to log channel: ${e}`);
      });
  }
}
