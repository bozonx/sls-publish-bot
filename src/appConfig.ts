import AppConfig from './types/AppConfig';
import {LOG_LEVELS} from './types/Logger';
import dotenv from 'dotenv';


dotenv.config();


const appConfig: AppConfig = {
  consoleLogLevel: process.env.CONSOLE_LOG_LEVEL as any || LOG_LEVELS.error,
  channelLogLevel: process.env.CHANNEL_LOG_LEVEL as any || LOG_LEVELS.info,
  botChatLogLevel: process.env.BOT_CHAT_LOG_LEVEL as any || LOG_LEVELS.info,
  utcOffset: 3,
  telegram: {
    parseMode: 'MarkdownV2',
  },
}

export default appConfig;
