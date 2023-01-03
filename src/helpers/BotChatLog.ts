import {LOG_LEVELS, Logger, LogLevel} from '../types/Logger.js';
import {calcAllowedLogLevels} from '../lib/common.js';
import TgChat from '../apiTg/TgChat.js';


export default class BotChatLog implements Logger {
  private readonly tgChat: TgChat;
  private readonly allowDebug: boolean
  private readonly allowInfo: boolean
  private readonly allowWarn: boolean


  constructor(level: LogLevel, tgChat: TgChat) {
    this.tgChat = tgChat;

    const allowedLogLevels: LogLevel[] = calcAllowedLogLevels(level);

    this.allowDebug = allowedLogLevels.includes(LOG_LEVELS.debug);
    this.allowInfo = allowedLogLevels.includes(LOG_LEVELS.info);
    this.allowWarn = allowedLogLevels.includes(LOG_LEVELS.warn);
  }


  debug = (message: string) => {
    if (!this.allowDebug) return

    this.tgChat.reply(`DEBUG: ${message}`)
      .catch((e) => {
        this.tgChat.app.consoleLog.error(`Can't send DEBUG message to log channel: ${e}`);
      });
  }

  info = (message: string) => {
    if (!this.allowInfo) return

    this.tgChat.reply(`INFO: ${message}`)
      .catch((e) => {
        this.tgChat.app.consoleLog.error(`Can't send INFO message to log channel: ${e}`);
      });
  }

  warn = (message: string) => {
    if (!this.allowWarn) return

    this.tgChat.reply(`WARNING: ${message}`)
      .catch((e) => {
        this.tgChat.app.consoleLog.error(`Can't send WARNING message to log channel: ${e}`);
      });
  }

  error = (message: string | Error) => {
    this.tgChat.reply(`ERROR: ${message}`)
      .catch((e) => {
        this.tgChat.app.consoleLog.error(`Can't send ERROR message to log channel: ${e}`);
      });
  }
}
