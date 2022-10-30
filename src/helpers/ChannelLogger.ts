import {Logger, LogLevel} from '../types/Logger';
import App from '../App';
import {calcAllowedLogLevels} from '../lib/common';


export default class ChannelLogger implements Logger {
  private readonly app: App;
  private readonly allowDebug: boolean
  private readonly allowInfo: boolean
  private readonly allowWarn: boolean


  constructor(app: App, level: LogLevel = 'info') {
    this.app = app;

    const allowedLogLevels: LogLevel[] = calcAllowedLogLevels(level)

    this.allowDebug = allowedLogLevels.includes('debug')
    this.allowInfo = allowedLogLevels.includes('info')
    this.allowWarn = allowedLogLevels.includes('warn')
  }


  debug = (message: string) => {
    if (!this.allowDebug) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `DEBUG: ${message}`,
      { parse_mode: this.app.config.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLogger.error(`Can't send message to log channel: ${e}`);
      });
  }

  info = (message: string) => {
    if (!this.allowInfo) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `INFO: ${message}`,
      { parse_mode: this.app.config.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLogger.error(`Can't send message to log channel: ${e}`);
      });
  }

  warn = (message: string) => {
    if (!this.allowWarn) return

    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `WARNING: ${message}`,
      { parse_mode: this.app.config.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLogger.error(`Can't send message to log channel: ${e}`);
      });
  }

  error = (message: string | Error) => {
    this.app.tg.bot.telegram.sendMessage(
      this.app.config.logChannelId,
      `ERROR: ${message}`,
      { parse_mode: this.app.config.telegram.parseMode }
    )
      .catch((e) => {
        this.app.consoleLogger.error(`Can't send message to log channel: ${e}`);
      });
  }
}
