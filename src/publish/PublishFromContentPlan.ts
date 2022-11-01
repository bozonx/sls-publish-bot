import TgChat from '../apiTg/TgChat';
import {DB_DEFAULT_PAGE_SIZE} from '../apiNotion/constants';
import moment from 'moment';
import {
  BlockObjectResponse,
  GetBlockResponse,
  PageObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentInfoMsg, parseContentItem, validateContentItem} from './parseContent';
import ContentItem, {SnTypes} from '../types/ContentItem';
import _ from 'lodash';
import {makePageInfoMsg, parsePageContent} from './parsePage';
import {askPublishConfirm} from '../askUser/askPublishConfirm';
import {publishFork} from './publishFork';


export interface ContentListItem {
  title: string;
  item: PageObjectResponse;
}


export default class PublishFromContentPlan {
  private readonly blogName: string;
  private readonly tgChat: TgChat;


  constructor(blogName: string, tgChat: TgChat) {
    this.blogName = blogName;
    this.tgChat = tgChat;
  }


  async start() {
    const items: ContentListItem[] = await this.loadNotPublished();

    await askContentToUse(items, this.tgChat, (item: PageObjectResponse) => {
      const parsedContentItem: ContentItem = parseContentItem(
        item,
        Object.keys(this.tgChat.app.config.blogs[this.blogName].sn) as SnTypes[],
      );

      try {
        validateContentItem(parsedContentItem);
      }
      catch (e) {
        this.tgChat.log.error(this.tgChat.app.i18n.errors.invalidContent + e);

        // TODO: ждать пока отправится лог
        // TODO: надо попробовать снова

        return;
      }

      this.printInfo(parsedContentItem)
        .catch((e) => this.tgChat.app.consoleLog.error(e));
    });
  }


  /**
   * Load not published items from content plan
   */
  private async loadNotPublished(): Promise<ContentListItem[]> {
    const currentDate: string = moment()
      .utcOffset(this.tgChat.app.appConfig.utcOffset)
      .format('YYYY-MM-DD');

    try {
      const response = await this.tgChat.app.notion.api.databases.query({
        database_id: this.tgChat.app.config.blogs[this.blogName].notionContentPlanDbId,
        ...this.makeContentPlanQuery(currentDate),
      });

      return this.prepareItems((response as any).results);
    }
    catch (e) {
      this.tgChat.log.error(`Can't load content plan data: ${e}`);

      // TODO: what to do in error case ????
      // TODO: нужно ли ждать отправки лога ????

      throw e;
    }
  }

  // TODO: указать тип взвращаемого значения
  private async loadRawPage(pageId: string): Promise<[Record<string, any>, BlockObjectResponse[]]> {

    /*
      {
        object: 'block',
        id: '2465ac4b-72d5-4032-927d-5664bb2ee592',
        parent: {
          type: 'database_id',
          database_id: 'f03e1717-ca62-4cd5-81c6-674551d53749'
        },
        created_time: '2022-10-29T09:57:00.000Z',
        last_edited_time: '2022-10-29T18:03:00.000Z',
        created_by: { object: 'user', id: 'dd4d9b08-24f5-4a24-9b36-19a42b496f44' },
        last_edited_by: { object: 'user', id: 'dd4d9b08-24f5-4a24-9b36-19a42b496f44' },
        has_children: true,
        archived: false,
        type: 'child_page',
        child_page: { title: 'заголовокккк' }
      }
     */

    const result = await this.tgChat.app.notion.api.blocks.retrieve({
      block_id: pageId,
    });

    console.log(1111111, result)

    if ((result as any).has_children) {
      const resultCh = await this.tgChat.app.notion.api.blocks.children.list({
        block_id: pageId,
      });

      /*
        next_cursor: null,
        has_more: false,
        type: 'block',

       */
      console.log(222222, JSON.stringify(resultCh.results))
    }

    throw new Error(`111`)


    try {
      //return await this.tgChat.app.notion.getPageMdBlocks(pageId);
    }
    catch (e) {
      this.tgChat.log.error(`Can't load page (${pageId}) data: ${e}`);

      // TODO: what to do in error case ????
      // TODO: нужно ли ждать отправки лога ????

      throw e;
    }
  }

  private prepareItems(results: PageObjectResponse[]): ContentListItem[] {
    return results
      .filter((item) => !item.archived)
      .map((item): ContentListItem => {
        const dateProp = item.properties['date'];
        const dateText: string = (dateProp as any).date.start;
        const shortDateText: string = moment(dateText).format('DD.MM');
        const gistProp = item.properties['gist/link'];
        const gistRichText: RichTextItemResponse = (gistProp as any).rich_text[0];

        return {
          title: `${shortDateText} ${gistRichText.plain_text}`,
          item,
        }
      });
  }

  // TODO: refactor
  private async printInfo(parsedContentItem: ContentItem) {
    const contentInfoMsg = makeContentInfoMsg(parsedContentItem, this.tgChat.app.i18n);
    // send record's info from content plan
    await this.tgChat.reply(
      this.tgChat.app.i18n.menu.contentParams + '\n\n' + contentInfoMsg
    );

    if (parsedContentItem.pageLink) {
      // send page info
      // TODO: лучше сделать сразу pageId

      const pageId: string = _.trimStart(parsedContentItem.pageLink, '/');
      const rawPage = await this.loadRawPage(pageId);
      const parsedPage = parsePageContent(rawPage[0], rawPage[1]);
      const pageInfoMsg = makePageInfoMsg(parsedPage, this.tgChat.app.i18n);

      await this.tgChat.reply(
        this.tgChat.app.i18n.menu.pageContent + '\n\n' + pageInfoMsg
      );

      await askPublishConfirm(this.tgChat, () => {
        publishFork(parsedContentItem, parsedPage, this.blogName, this.tgChat)
          .catch((e) => this.tgChat.app.consoleLog.error(e));
      });
    }
    else {
      // TODO: если нет ссылки то что делать? - обьявление
      // TODO: проверить что для обьявления выбран telegram
    }
  }

  private makeContentPlanQuery(currentDate: string): Record<string, any> {

    // TODO: фильтровать только поддерживаемые в данный момент
    // TODO: фильтровать поддерживаемые типы канала

    return {
      page_size: DB_DEFAULT_PAGE_SIZE,
      filter: {
        and: [
          {
            property: 'date',
            date: {
              on_or_after: currentDate,
            },
          },
          {
            or: [
              {
                property: 'status',
                select: {
                  equals: 'to_edit',
                },
              },
              {
                property: 'status',
                select: {
                  equals: 'to_correct',
                },
              },
              {
                property: 'status',
                select: {
                  equals: 'to_publish',
                },
              },
            ],
          }
        ],

      },
      sorts: [
        {
          property: 'date',
          direction: 'descending',
        },
      ],
    }
  }

}
