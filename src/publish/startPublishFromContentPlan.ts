import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentPlanItemDetails, prepareContentItem} from './parseContent';
import ContentItem, {PUBLICATION_TYPES, SnTypes} from '../types/ContentItem';
import {makePageDetailsMsg, preparePage} from './parsePage';
import {askPublishMenu, PublishMenuState} from '../askUser/askPublishMenu';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {loadPageProps} from '../notionRequests/pageProps';
import RawPageContent from '../types/PageContent';
import {makeDateTimeStr, prepareFooter, resolveSns} from '../helpers/helpers';
import {getFirstImageFromNotionBlocks, makeContentLengthString} from './publishHelpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {NOTION_BLOCKS} from '../types/types';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  // load not published records from content plan
  const notPublishedItems: PageObjectResponse[] = await loadNotPublished(blogName,tgChat);
  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    try {
      const parsedContentItem = prepareContentItem(item, tgChat.app.i18n);
      const parsedPage = await loadAndPreparePage(parsedContentItem, blogName, tgChat);

      if (!parsedPage && parsedContentItem.type !== PUBLICATION_TYPES.announcement) {
        // if not nested page and it isn't announcement
        await tgChat.reply(tgChat.app.i18n.errors.noNestedPage);
        await tgChat.steps.back();
      }

      const blogSns = Object.keys(tgChat.app.config.blogs[blogName].sn) as SnTypes[];
      const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type);
      const mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);

      await printItemDetails(blogName, tgChat, resolvedSns, parsedContentItem, parsedPage, mainImgUrl);
      await askMenu(blogName, tgChat, resolvedSns, parsedContentItem, parsedPage, mainImgUrl);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);

      await tgChat.steps.back();

      return;
    }
  }));
}


async function loadAndPreparePage(
  parsedContentItem: ContentItem,
  blogName: string,
  tgChat: TgChat
): Promise<RawPageContent | undefined> {
  if (!parsedContentItem.relativePageId) return;
  // load props of page from notion
  const pageProperties = await loadPageProps(parsedContentItem.relativePageId, tgChat);
  // load all the page blocks from notion
  const pageContent = await loadPageBlocks(parsedContentItem.relativePageId, tgChat);

  return preparePage(pageProperties, pageContent, tgChat.app.i18n);
}

async function printItemDetails(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnTypes[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string
) {
  await printImage(blogName, tgChat, mainImgUrl);
  const footerStr = prepareFooter(
    tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
    parsedPage?.tgTags,
    true
  );
  if (footerStr) {
    await tgChat.reply(
      tgChat.app.i18n.menu.postFooter + footerStr,
      undefined,
      true,
      true
    );
  }

  // make content plan info details message
  const contentInfoMsg = makeContentPlanItemDetails(
    parsedContentItem,
    tgChat.app.i18n,
    tgChat.app.appConfig.utcOffset
  );
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
  }

  await printContent(
    blogName,
    tgChat,
    parsedPage?.textBlocks,
    parsedContentItem.gist,
    parsedPage?.tgTags,
    parsedPage?.instaTags,
    footerStr,
  );

  if (!resolvedSns.length) await tgChat.reply(tgChat.app.i18n.errors.noSns);
}

async function printImage(blogName: string, tgChat: TgChat, mainImgUrl?: string) {
  if (mainImgUrl) {
    try {
      await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, mainImgUrl)
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.cantSendImage)
    }
  }
}

async function printContent(
  blogName: string,
  tgChat: TgChat,
  textBlocks?: NOTION_BLOCKS,
  postText?: string,
  tgTags?: string[],
  instaTags?: string[],
  footerStr?: string,
) {
  if (textBlocks) {
    await tgChat.reply(makeContentLengthString(
      tgChat.app.i18n,
      textBlocks,
      tgTags,
      instaTags,
      footerStr
    ));
  }
  else {
    await tgChat.reply(
      tgChat.app.i18n.menu.announcementGist + '\n' + postText
    );
  }
}


async function askMenu(
  blogName: string,
  tgChat: TgChat,
  resolvedSns: SnTypes[],
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string,
) {
  const state: PublishMenuState = {
    pubType: parsedContentItem.type,
    usePreview: true,
    useFooter: true,
    sns: resolvedSns,
    selectedDate: parsedContentItem.date,
    selectedTime: parsedContentItem.time,
    mainImgUrl,
  };

  await askPublishMenu(blogName, tgChat, state, tgChat.asyncCb(async () => {

    // TODO: текст для instagram

    await printImage(blogName, tgChat, mainImgUrl);

    const footerStr = prepareFooter(
      tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
      parsedPage?.tgTags,
      true
    );
    if (footerStr) {
      await tgChat.reply(
        tgChat.app.i18n.menu.postFooter + footerStr,
        undefined,
        true,
        true
      );
    }

    await tgChat.reply(
      tgChat.app.i18n.commonPhrases.selectedNoPreview + tgChat.app.i18n.onOff[1] + '\m'
      + tgChat.app.i18n.commonPhrases.sns + ': ' + state.sns.join(', ')
      + tgChat.app.i18n.contentInfo.dateTime + ': '
        + makeDateTimeStr(state.selectedDate, state.selectedTime, tgChat.app.appConfig.utcOffset)
    );

    if (!state.sns.length) await tgChat.reply(tgChat.app.i18n.errors.noSns);

    await printContent(
      blogName,
      tgChat,
      parsedPage?.textBlocks,
      state.postText,
      parsedPage?.tgTags,
      parsedPage?.instaTags,
      footerStr,
    );

    // TODO: не показывать кнопку ok если нет соц сетей или другие ошибки

    await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
      // TODO: может на всё обрабатывать ошибку, написать пользвателю и сделать back()
      // TODO: нужно обработать ошибку и написать пользователю
      // Do publish
      await publishFork(
        blogName,
        tgChat,
        parsedContentItem,
        state.usePreview,
        state.useFooter,
        state.selectedTime,
        parsedPage,
      );

      await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
      await tgChat.steps.cancel();
    }));
  }));
}
