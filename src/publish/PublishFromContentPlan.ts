import TgChat from '../tgApi/TgChat';
import {DB_DEFAULT_PAGE_SIZE} from '../notionApi/constants';
import moment from 'moment';
import {
  PageObjectResponse,
  RichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentInfoMsg, parseContentItem, validateContentItem} from './parseContent';
import ContentItem from '../types/ContentItem';
import {SnTypes} from '../types/types';
import _ from 'lodash';
import {MdBlock} from 'notion-to-md/build/types';
import {makePageInfoMsg, parsePageContent} from './parsePage';
import {askPublishConfirm} from '../askUser/askPublishConfirm';
import {publishFork} from './publishFork';


export interface ContentListItem {
  title: string;
  item: PageObjectResponse;
}


export default class PublishFromContentPlan {
  private readonly channelId: number;
  private readonly tgChat: TgChat;


  constructor(channelId: number, tgChat: TgChat) {
    this.channelId = channelId;
    this.tgChat = tgChat;
  }


  async start() {
    const items: ContentListItem[] = await this.loadNotPublished();

    await askContentToUse(items, this.tgChat, (item: PageObjectResponse) => {
      const parsedContentItem: ContentItem = parseContentItem(
        item,
        Object.keys(this.tgChat.app.config.channels[this.channelId].sn) as SnTypes[],
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
      .utcOffset(this.tgChat.app.config.utcOffset)
      .format('YYYY-MM-DD');

    try {
      const response = await this.tgChat.app.notion.api.databases.query({
        database_id: this.tgChat.app.config.channels[this.channelId].notionContentPlanDbId,
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

  private async loadRawPage(pageId: string): Promise<[Record<string, any>, MdBlock[]]> {
    try {
      return await this.tgChat.app.notion.getPageMdBlocks(pageId);
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
        publishFork(parsedContentItem, parsedPage, this.channelId, this.tgChat)
          .catch((e) => this.tgChat.app.consoleLog.error(e));
      });
    }
    else {
      // TODO: если нет ссылки то что делать? - обьявление
      // TODO: проверить что для обьявления выбран telegram
    }
  }

  private makeContentPlanQuery(currentDate: string): Record<string, any> {

    // TODO: фильтровать только поддерживаемые типы

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
