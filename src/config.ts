import dotenv from 'dotenv';
import AppConfig from './types/AppConfig';
import {PUBLICATION_TYPES, SN_TYPES} from './types/consts';
import {LOG_LEVELS} from './types/Logger';


dotenv.config();

const conf: AppConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  telegraPhToken: process.env.TELEGRA_PH_TOKEN as any,
  consoleLogLevel: process.env.CONSOLE_LOG_LEVEL as any || LOG_LEVELS.error,
  channelLogLevel: process.env.CHANNEL_LOG_LEVEL as any || LOG_LEVELS.info,
  botChatLogLevel: process.env.BOT_CHAT_LOG_LEVEL as any || LOG_LEVELS.info,
  utcOffset: 3,
  logChannelId: -1001664865912,
  telegram: {
    parseMode: 'MarkdownV2',
  },
  channels: [
    {
      channelId: -1001664865912,
      name: 'test',
      dispname: 'Тестовый канал',
      notionContentPlanDbId: '0ce847766986402f9d221852ded2b599',
      supportedTypes: [
        PUBLICATION_TYPES.article,
        PUBLICATION_TYPES.post1000,
        PUBLICATION_TYPES.post2000,
        PUBLICATION_TYPES.photos,
        PUBLICATION_TYPES.story,
      ],
      sn: {
        telegram: {
          telegraPhAuthorName: 'Testtt',
          telegraPhAuthorUrl: 'https://t.me/+DT00UFZf3_IwYmY6',
        },
        instagram: {},
        zen: {},
      }
    },
  ]
}

export default conf;
