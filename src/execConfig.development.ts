import ExecConfig from './types/ExecConfig';
import {PUBLICATION_TYPES} from './types/ContentItem';


const execConf: ExecConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  telegraPhToken: process.env.TELEGRA_PH_TOKEN as any,
  logChannelId: process.env.LOG_CHANNEL_ID as any,
  blogs: {
    slsfreedom: {
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
          channelId: -1001664865912,
        },
        instagram: {},
        zen: {},
        site: {},
      },
    },
  }
}

export default execConf;
