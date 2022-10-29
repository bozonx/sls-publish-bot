import dotenv from 'dotenv';
import AppConfig from './types/AppConfig';
import {PUBLICATION_TYPES, SN_TYPES} from './types/consts';


dotenv.config();

const conf: AppConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  utcOffset: 3,
  channels: [
    {
      channelId: '',
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
        [SN_TYPES.telegram]: {},
        [SN_TYPES.instagram]: {},
        [SN_TYPES.zen]: {},
      }
    },
  ]
}

export default conf;
