import _ from 'lodash';
import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentPlanItemDetails, parseContentItem, validateContentItem} from './parseContent';
import ContentItem, {SnTypes} from '../types/ContentItem';
import {makePageDetailsMsg, parsePageContent} from './parsePage';
import {askPublishConfirm, PUBLISH_CONFIRM_ACTION, PublishConfirmAction} from '../askUser/askPublishConfirm';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {loadPageProps} from '../notionRequests/pageProps';
import {askSelectTime} from '../askUser/askSelectTime';
import RawPageContent from '../types/PageContent';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  // load not published records from content plan
  const notPublishedItems: PageObjectResponse[] = await loadNotPublished(blogName,tgChat);
  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    // User selected page - parse it
    const blogSns = Object.keys(tgChat.app.config.blogs[blogName].sn) as SnTypes[];
    const parsedContentItem: ContentItem = parseContentItem(item, blogSns);

    try {
      validateContentItem(parsedContentItem);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.invalidContent + e);

      await tgChat.steps.back();

      return;
    }

    try {
      const parsedPage = await printAllDetails(parsedContentItem, blogName, tgChat);

      await askMenu(parsedContentItem, blogName, tgChat, parsedPage);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);

      await tgChat.steps.back();

      return;
    }
  }));
}


async function printAllDetails(
  parsedContentItem: ContentItem,
  blogName: string,
  tgChat: TgChat
): Promise<RawPageContent | undefined> {
  let parsedPage: RawPageContent | undefined;

  await printContentPlanDetails(parsedContentItem, blogName, tgChat);

  if (parsedContentItem.relativePageId) {
    parsedPage = await printPageDetails(parsedContentItem.relativePageId, blogName, tgChat);
  }
  else {
    // TODO: если нет ссылки то что делать? - обьявление
    // TODO: проверить что для обьявления выбран telegram
  }

  // print footer
  if (tgChat.app.config.blogs[blogName].sn.telegram?.postFooter) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + ': '
      + tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
      undefined,
      false,
    );
  }

  return parsedPage;
}

async function printContentPlanDetails(parsedContentItem: ContentItem, blogName: string, tgChat: TgChat) {
  // make content plan info details message
  const contentInfoMsg = makeContentPlanItemDetails(parsedContentItem, tgChat.app.i18n);
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n' + contentInfoMsg
  );
}

async function printPageDetails(pageId: string, blogName: string, tgChat: TgChat): Promise<RawPageContent> {
  // load props of page from notion
  const pageProperties = await loadPageProps(pageId, tgChat);
  // load all the page blocks from notion
  const pageContent = await loadPageBlocks(pageId, tgChat);
  const parsedPage = parsePageContent(pageProperties, pageContent);
  const pageDetailsMsg = makePageDetailsMsg(parsedPage, tgChat.app.i18n);

  // TODO: а валидация ???

  await tgChat.reply(
    tgChat.app.i18n.menu.pageContent + '\n\n' + pageDetailsMsg
  );

  return parsedPage;
}

async function askMenu(
  parsedContentItem: ContentItem,
  blogName: string,
  tgChat: TgChat,
  parsedPage?: RawPageContent
) {
  await askPublishConfirm(tgChat, tgChat.asyncCb(async (action: PublishConfirmAction) => {
    switch (action) {
      case PUBLISH_CONFIRM_ACTION.OK:
        await publishFork(blogName, tgChat, parsedContentItem, parsedPage);

        break;
      case PUBLISH_CONFIRM_ACTION.CHANGE_TIME:
        await askSelectTime(tgChat, tgChat.asyncCb(async (time: string) => {
          await tgChat.reply(
            tgChat.app.i18n.menu.selectedTimeMsg
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
