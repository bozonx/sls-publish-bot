import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentPlanItemDetails, parseContentItem, validateContentItem} from './parseContent';
import ContentItem, {PUBLICATION_TYPES, SnTypes} from '../types/ContentItem';
import {makePageDetailsMsg, parsePageContent, validatePageItem} from './parsePage';
import {
  askPublishMenu,
  PUBLISH_MENU_ACTION,
  PublishMenuAction,
  PublishMenuState
} from '../askUser/askPublishMenu';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {loadPageProps} from '../notionRequests/pageProps';
import {askSelectTime} from '../askUser/askSelectTime';
import RawPageContent from '../types/PageContent';
import {makeUtcOffsetStr, prepareFooterPost} from '../helpers/helpers';
import {getFirstImageFromNotionBlocks, makeContentLengthString} from './publishHelpers';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  // load not published records from content plan
  const notPublishedItems: PageObjectResponse[] = await loadNotPublished(blogName,tgChat);
  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    try {
      const parsedContentItem = await prepareContentItem(item, blogName, tgChat);
      const parsedPage = await preparePage(parsedContentItem, blogName, tgChat);
      const mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);

      await printAllDetails(blogName, tgChat, parsedContentItem, parsedPage, mainImgUrl);
      await askMenu(blogName, tgChat, parsedContentItem, parsedPage, mainImgUrl);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);

      await tgChat.steps.back();

      return;
    }
  }));
}


async function prepareContentItem(
  rawItem: PageObjectResponse,
  blogName: string,
  tgChat: TgChat
): Promise<ContentItem> {
  const blogSns = Object.keys(tgChat.app.config.blogs[blogName].sn) as SnTypes[];
  const parsedContentItem: ContentItem = parseContentItem(rawItem, blogSns);

  try {
    validateContentItem(parsedContentItem);
  }
  catch (e) {
    throw new Error(tgChat.app.i18n.errors.invalidContent + e);
  }

  return parsedContentItem;
}

async function preparePage(
  parsedContentItem: ContentItem,
  blogName: string,
  tgChat: TgChat
): Promise<RawPageContent | undefined> {
  if (!parsedContentItem.relativePageId) return;
  // load props of page from notion
  const pageProperties = await loadPageProps(parsedContentItem.relativePageId, tgChat);
  // load all the page blocks from notion
  const pageContent = await loadPageBlocks(parsedContentItem.relativePageId, tgChat);
  const parsedPage = parsePageContent(pageProperties, pageContent);

  validatePageItem(parsedPage)

  return parsedPage;
}

async function printAllDetails(
  blogName: string,
  tgChat: TgChat,
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string
) {
  if (mainImgUrl) {
    try {
      await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, mainImgUrl)
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.cantSendImage)
    }
  }
  // make content plan info details message
  const contentInfoMsg = makeContentPlanItemDetails(parsedContentItem, tgChat.app.i18n);
  // send record's info from content plan
  await tgChat.reply(
    tgChat.app.i18n.menu.contentParams + '\n\n' + contentInfoMsg
  );

  if (parsedPage) {
    // if has nested page
    const pageDetailsMsg = makePageDetailsMsg(parsedPage, tgChat.app.i18n);

    await tgChat.reply(
      tgChat.app.i18n.menu.pageContent + '\n\n' + pageDetailsMsg
    );

    const tgFooter = prepareFooterPost(
      tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
      parsedPage?.tgTags
    );

    // print footer
    if (tgChat.app.config.blogs[blogName].sn.telegram?.postFooter) {
      await tgChat.reply(
        tgChat.app.i18n.menu.postFooter + tgFooter,
        undefined,
        true,
        true
      );
    }

    // tgChat.app.i18n.commonPhrases.selectedNoPreview + tgChat.app.i18n.onOff[1] + '\n'

    if (parsedPage) {
      await tgChat.reply(makeContentLengthString(tgChat.app.i18n, parsedPage, tgFooter));
    }
  }
  else {
    if (parsedContentItem.type === PUBLICATION_TYPES.announcement) {
      // TODO: проверить что для обьявления выбран telegram
      await tgChat.reply(
        tgChat.app.i18n.menu.announcementGist + '\n' + parsedContentItem.gist
      );
    }
    else {
      await tgChat.reply(tgChat.app.i18n.errors.noNestedPage);

      await tgChat.steps.back();
    }
  }
}


async function askMenu(
  blogName: string,
  tgChat: TgChat,
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string,
) {
  const state: PublishMenuState = {
    pubType: parsedContentItem.type,
    usePreview: true,
    useFooter: true,
    // TODO: зарезолвить соц сети
    sns: [],
    mainImgUrl,
  };

  await askPublishMenu(
    blogName,
    tgChat,
    state,
    tgChat.asyncCb(async (action: PublishMenuAction) => {

      // TODO: может на всё обрабатывать ошибку, написать пользвателю и сделать back()

      switch (action) {
        case PUBLISH_MENU_ACTION.OK:
          // TODO: нужно обработать ошибку и написать пользователю
          // Do publish
          await publishFork(
            blogName,
            tgChat,
            parsedContentItem,
            usePreview,
            useFooter,
            correctedTime,
            parsedPage,
          );

          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.cancel();

          break;
        case PUBLISH_MENU_ACTION.CHANGE_TIME:
          await askSelectTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
            await tgChat.reply(
              tgChat.app.i18n.commonPhrases.selectedDateAndTime
              + `${parsedContentItem.date} ${newTime} ${makeUtcOffsetStr(tgChat.app.appConfig.utcOffset)}`
            );
            await askMenu(
              blogName,
              tgChat,
              parsedContentItem,
              parsedPage,
              newTime,
              usePreview,
              useFooter
            );
          }));

          break;
        case PUBLISH_MENU_ACTION.NO_POST_FOOTER:
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.selectedNoFooter
            + tgChat.app.i18n.onOff[Number(useFooter)]
          );
          await askMenu(
            blogName,
            tgChat,
            parsedContentItem,
            parsedPage,
            correctedTime,
            usePreview,
            !useFooter,
          );

          break;
        case PUBLISH_MENU_ACTION.NO_PREVIEW:
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.selectedNoPreview
            + tgChat.app.i18n.onOff[Number(!usePreview)]
          );
          await askMenu(
            blogName,
            tgChat,
            parsedContentItem,
            parsedPage,
            correctedTime,
            !usePreview,
            useFooter,
          );

          break;
        default:
          throw new Error(`Unknown action ${action}`);
      }
    }
  ),
    // usePreview,
    // useFooter,
    // parsedContentItem.type,
    // Boolean(parsedPage?.imageUrl),
    // correctedTime
  );

}
