import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {makeContentPlanItemDetails, parseContentItem, validateContentItem} from './parseContent';
import ContentItem, {PUBLICATION_TYPES, SnTypes} from '../types/ContentItem';
import {makePageDetailsMsg, parsePageContent, validatePageItem} from './parsePage';
import {askPublishMenu, PublishMenuState} from '../askUser/askPublishMenu';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {loadPageProps} from '../notionRequests/pageProps';
import RawPageContent from '../types/PageContent';
import {prepareFooterPost} from '../helpers/helpers';
import {getFirstImageFromNotionBlocks, makeContentLengthString} from './publishHelpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {NOTION_BLOCKS} from '../types/types';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  // load not published records from content plan
  const notPublishedItems: PageObjectResponse[] = await loadNotPublished(blogName,tgChat);
  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    try {
      const parsedContentItem = await prepareContentItem(item, blogName, tgChat);
      const parsedPage = await preparePage(parsedContentItem, blogName, tgChat);

      if (!parsedPage && parsedContentItem.type !== PUBLICATION_TYPES.announcement) {
        // if not nested page and it isn't announcement
        await tgChat.reply(tgChat.app.i18n.errors.noNestedPage);
        await tgChat.steps.back();
      }

      const mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);

      await printItemDetails(blogName, tgChat, parsedContentItem, parsedPage, mainImgUrl);
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

  validatePageItem(parsedPage);

  return parsedPage;
}

async function printItemDetails(
  blogName: string,
  tgChat: TgChat,
  parsedContentItem: ContentItem,
  parsedPage?: RawPageContent,
  mainImgUrl?: string
) {
  await printImage(blogName, tgChat, mainImgUrl);
  const footerStr = await printFooter(blogName, tgChat, true, parsedPage?.tgTags);

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
  }
  // TODO: наверное перенести в printPublicationContent
  else if (parsedContentItem.type === PUBLICATION_TYPES.announcement) {
    // don't have the nested page and it is annoucement
    // TODO: проверить что для обьявления выбран telegram
    await tgChat.reply(
      tgChat.app.i18n.menu.announcementGist + '\n' + parsedContentItem.gist
    );
    // TODO: может тоже подсчитать длину???
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

async function printFooter(
  blogName: string,
  tgChat: TgChat,
  useFooter: boolean,
  tgTags?: string[]
): Promise<string | undefined> {
  let tgFooter: string | undefined;
  const postFooter = tgChat.app.config.blogs[blogName].sn.telegram?.postFooter;

  if (useFooter) {
    tgFooter = prepareFooterPost(postFooter, tgTags);

    // print footer
    if (postFooter) {
      await tgChat.reply(
        tgChat.app.i18n.menu.postFooter + tgFooter,
        undefined,
        true,
        true
      );
    }
  }

  return tgFooter;
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
    selectedDate: parsedContentItem.date,
    selectedTime: parsedContentItem.time,
    mainImgUrl,
  };

  await askPublishMenu(blogName, tgChat, state, tgChat.asyncCb(async () => {
    // TODO: sns
    // TODO: date and time
    // TODO: use preview
    // tgChat.app.i18n.commonPhrases.selectedNoPreview + tgChat.app.i18n.onOff[1] + '\n'

    await printImage(blogName, tgChat, mainImgUrl);
    const footerStr = await printFooter(blogName, tgChat, state.useFooter, parsedPage?.tgTags);

    await printContent(
      blogName,
      tgChat,
      parsedPage?.textBlocks,
      state.postText,
      parsedPage?.tgTags,
      parsedPage?.instaTags,
      footerStr,
    );

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
