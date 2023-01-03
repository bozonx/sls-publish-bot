import AppConfig from './types/AppConfig';
import {LOG_LEVELS} from './types/Logger';
import dotenv from 'dotenv';


dotenv.config();


const appConfig: AppConfig = {
  consoleLogLevel: process.env.CONSOLE_LOG_LEVEL as any || LOG_LEVELS.error,
  channelLogLevel: process.env.CHANNEL_LOG_LEVEL as any || LOG_LEVELS.info,
  botChatLogLevel: process.env.BOT_CHAT_LOG_LEVEL as any || LOG_LEVELS.info,
  // TODO: использовать общую папку data dir
  stateDirPath: process.env.DATA_DIR as any || './_testState',
  utcOffset: Number(process.env.UTC_OFFSET || 0),
  // TODO: WTF ???!!!
  // skip tasks which should be run earlier that specified value in seconds
  skipTasksEarlierSec: Number(process.env.SKIP_TASKS_EARLIER_SEC || 1),
  telegram: {
    parseMode: 'MarkdownV2',
  },

  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  telegraPhToken: process.env.TELEGRA_PH_TOKEN as any,
  logChannelId: process.env.LOG_CHANNEL_ID as any,
}

export default appConfig;
