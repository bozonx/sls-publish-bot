import ExecConfig from './types/ExecConfig';
import dotenv from 'dotenv';
import {PUBLICATION_TYPES} from './types/publicationType';


dotenv.config();


const execConf: ExecConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  telegraPhToken: process.env.TELEGRA_PH_TOKEN as any,
  logChannelId: process.env.LOG_CHANNEL_ID as any,
  blogs: {
    test: {
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
          postFooter:  '\n\n[СОЖ 🌴](https://t.me/+DT00UFZf3_IwYmY6) \\| ${ TAGS }',
          storyFooter: '\n\n[СОЖ 🌴](https://t.me/+DT00UFZf3_IwYmY6) \\| \\#сторис',
          memFooter:   '\n\n[СОЖ 🌴](https://t.me/+DT00UFZf3_IwYmY6) \\| \\#мем',
          reelFooter:  '\n\n[СОЖ 🌴](https://t.me/+DT00UFZf3_IwYmY6) \\| \\#рилс',
          articlePostTmpl: '[${ TITLE }](${ ARTICLE_URL })\n\n${ TAGS }',
          articleFooter: [
            'Автор: Козырин Иван',
            {
              tag: 'a',
              attrs: {href: 'https://t.me/+DT00UFZf3_IwYmY6'},
              children: ['Система Личной Свободы'],
            }
          ],
        },
        instagram: {},
        zen: {},
        site: {},
      },
    },
  }
}

export default execConf;
