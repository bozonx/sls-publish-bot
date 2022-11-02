import TgChat from '../apiTg/TgChat';
import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentInfoMsg, parseContentItem, validateContentItem} from './parseContent';
import ContentItem, {SnTypes} from '../types/ContentItem';
import _ from 'lodash';
import {makePageInfoMsg, parsePageContent} from './parsePage';
import {askPublishConfirm} from '../askUser/askPublishConfirm';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageContent} from '../notionRequests/pageContent';


export default class PublishFromContentPlan {
  private readonly blogName: string;
  private readonly tgChat: TgChat;


  constructor(blogName: string, tgChat: TgChat) {
    this.blogName = blogName;
    this.tgChat = tgChat;
  }


  async start() {
    const items: PageObjectResponse[] = await loadNotPublished(
      this.blogName,
      this.tgChat
    );

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

      // TODO: а чё не ждём завершения ???
      this.printInfo(parsedContentItem)
        .catch((e) => this.tgChat.app.consoleLog.error(e));
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
      const rawPage = await loadPageContent(pageId, this.tgChat);
      const parsedPage = parsePageContent(this.selectedPage, rawPage);
      const pageInfoMsg = makePageInfoMsg(parsedPage, this.tgChat.app.i18n);

      await this.tgChat.reply(
        this.tgChat.app.i18n.menu.pageContent + '\n\n' + pageInfoMsg
      );

      await askPublishConfirm(this.tgChat, () => {
        publishFork(this.blogName, this.tgChat, parsedContentItem, parsedPage)
          .catch((e) => this.tgChat.app.consoleLog.error(e));
      });
    }
    else {
      // TODO: если нет ссылки то что делать? - обьявление
      // TODO: проверить что для обьявления выбран telegram
    }
  }

}
