import AppConfig from './types/AppConfig.js';
import {LOG_LEVELS} from './types/Logger.js';
import dotenv from 'dotenv';


dotenv.config();


const appConfig: AppConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  telegraPhToken: process.env.TELEGRA_PH_TOKEN as any,
  logChannelId: process.env.LOG_CHANNEL_ID as any,

  consoleLogLevel: process.env.CONSOLE_LOG_LEVEL as any || LOG_LEVELS.error,
  channelLogLevel: process.env.CHANNEL_LOG_LEVEL as any || LOG_LEVELS.info,
  botChatLogLevel: process.env.BOT_CHAT_LOG_LEVEL as any || LOG_LEVELS.info,
  dataDirPath: process.env.DATA_DIR as any,
  utcOffset: Number(process.env.UTC_OFFSET || 0),
  // skip tasks which should be run earlier that specified value in seconds
  expiredTaskOffsetSec: Number(process.env.EXPIRED_TASK_OFFSET_SEC || 1),

  itemsPerPage: 10,

  telegram: {
    parseMode: 'HTML',
  },
}

export default appConfig;
