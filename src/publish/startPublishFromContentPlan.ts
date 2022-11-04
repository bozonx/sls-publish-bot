import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentInfoMsg, parseContentItem, validateContentItem} from './parseContent';
import ContentItem, {SnTypes} from '../types/ContentItem';
import _ from 'lodash';
import {makePageInfoMsg, parsePageContent} from './parsePage';
import {askPublishConfirm, PUBLISH_CONFIRM_ACTION, PublishConfirmAction} from '../askUser/askPublishConfirm';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageContent} from '../notionRequests/pageContent';
import {loadPageProps} from '../notionRequests/pageProps';
import {askSelectTime} from '../askUser/askSelectTime';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  // load not published records from content plan
  const notPublishedItems: PageObjectResponse[] = await loadNotPublished(blogName,tgChat);
  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    const parsedContentItem: ContentItem = parseContentItem(
      item,
      Object.keys(tgChat.app.config.blogs[blogName].sn) as SnTypes[],
    );

    try {
      validateContentItem(parsedContentItem);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.invalidContent + e);

      await tgChat.steps.back();

      return;
    }

    // TODO: обработать ошибку - вернуть назад или чо
    await printInfo(parsedContentItem);
  }));
}


// TODO: refactor
async function printInfo(parsedContentItem: ContentItem) {


  const contentInfoMsg = makeContentInfoMsg(parsedContentItem, this.tgChat.app.i18n);
  // send record's info from content plan
  await this.tgChat.reply(
    this.tgChat.app.i18n.menu.contentParams + '\n\n' + contentInfoMsg
  );

  if (parsedContentItem.pageLink) {
    // send page info
    // TODO: лучше сделать сразу pageId

    const pageId: string = _.trimStart(parsedContentItem.pageLink, '/');
    const pageProperties = await loadPageProps(pageId, this.tgChat);
    const pageContent = await loadPageContent(pageId, this.tgChat);
    const parsedPage = parsePageContent(pageProperties, pageContent);
    const pageInfoMsg = makePageInfoMsg(parsedPage, this.tgChat.app.i18n);

    await this.tgChat.reply(
      this.tgChat.app.i18n.menu.pageContent + '\n\n' + pageInfoMsg
    );

    if (this.tgChat.app.config.blogs[this.blogName].sn.telegram?.postFooter) {
      await this.tgChat.reply(
        this.tgChat.app.i18n.menu.postFooter + ': '
        + this.tgChat.app.config.blogs[this.blogName].sn.telegram?.postFooter
      );
    }


    await askPublishConfirm(this.tgChat, this.tgChat.asyncCb(async (action: PublishConfirmAction) => {
      switch (action) {
        case PUBLISH_CONFIRM_ACTION.OK:
          await publishFork(this.blogName, this.tgChat, parsedContentItem, parsedPage);

          break;
        case PUBLISH_CONFIRM_ACTION.CHANGE_TIME:
          await askSelectTime(this.tgChat, this.tgChat.asyncCb(async (time: string) => {
            await this.tgChat.reply(
              this.tgChat.app.i18n.menu.selectedTimeMsg
              + parsedContentItem.date + ' ' + time
            );
          }));

          break;

        // TODO: не должно быть если не задан в конфиге
        case PUBLISH_CONFIRM_ACTION.NO_POST_FOOTER:
          // TODO: add

          break;
        default:
          throw new Error(`Unknown action ${action}`);

          break;
      }
    }));
  }
  else {
    // TODO: если нет ссылки то что делать? - обьявление
    // TODO: проверить что для обьявления выбран telegram
  }
}
