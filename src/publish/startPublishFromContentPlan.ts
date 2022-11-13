import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from '../askUser/askContentToUse';
import {prepareContentItem} from './parseContent';
import ContentItem, {PUBLICATION_TYPES, SnTypes} from '../types/ContentItem';
import {preparePage} from './parsePage';
import {askPublishMenu, PublishMenuState} from '../askUser/askPublishMenu';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from './publishFork';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {loadPageProps} from '../notionRequests/pageProps';
import RawPageContent from '../types/PageContent';
import {resolveSns} from '../helpers/helpers';
import {getFirstImageFromNotionBlocks,} from './publishHelpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {printImage, printItemDetails, printPublishConfirmData} from './printInfo';
import {WARN_SIGN} from '../types/constants';
import validateContentPlanPost, {validateContentPlanPostText} from './validateContentPlanPost';
import {makeClearTextFromNotion} from '../helpers/clearTextForSn';


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
      const clearTexts = makeClearTextFromNotion(
        resolvedSns,
        parsedContentItem.type,
        tgChat.app.config.blogs[blogName].sn.telegram,
        parsedPage?.textBlocks,
        parsedContentItem.gist
      );
      let mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);

      mainImgUrl = await printImage(tgChat, mainImgUrl);

      await printItemDetails(blogName, tgChat, clearTexts, resolvedSns, parsedContentItem, parsedPage);
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

  return preparePage(parsedContentItem.type, pageProperties, pageContent, tgChat.app.i18n);
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
    instaTags: parsedPage?.instaTags,
    mainImgUrl,
  };

  await askPublishMenu(blogName, tgChat, state, tgChat.asyncCb(async () => {
    state.mainImgUrl = await printImage(tgChat, mainImgUrl);

    const clearTexts = makeClearTextFromNotion(
      state.sns,
      state.pubType,
      tgChat.app.config.blogs[blogName].sn.telegram,
      parsedPage?.textBlocks,
      state.postText
    );

    await printPublishConfirmData(blogName, tgChat, state, clearTexts, parsedPage);

    let disableOk = false;

    try {
      validateContentPlanPost(state, tgChat);
      validateContentPlanPostText(clearTexts, parsedContentItem.type, tgChat);
    }
    catch (e) {
      await tgChat.reply(`${WARN_SIGN} ${e}`);

      disableOk = true;
    }

    await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
      try {
        // Do publish
        await publishFork(
          blogName,
          tgChat,
          state,
          parsedContentItem.type,
          // TODO: add postTexts
          // TODO: add articleTexts
        );
      }
      catch (e) {
        await tgChat.reply(`${WARN_SIGN} ${e}`);
        await tgChat.steps.back();

        return;
      }

      await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
      await tgChat.steps.cancel();
    }), disableOk);
  }));
}
