import ExecConfig from './types/ExecConfig';
import {PUBLICATION_TYPES} from './types/publicationType';


const execConf: ExecConfig = {
  blogs: {
    test: {
      dispname: 'Тестовый канал',
      notionContentPlanDbId: '0ce847766986402f9d221852ded2b599',
      notionCreativeDbId: '0c83f31f420f41748752bd0628d723e4',
      // TODO: наверное надо на каждую соц сеть
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
