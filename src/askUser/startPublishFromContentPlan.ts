import TgChat from '../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {askContentToUse} from './askContentToUse';
import {prepareContentItem} from '../publish/parseContent';
import ContentItem from '../types/ContentItem';
import {preparePage} from '../publish/parsePage';
import {askPublishMenu, PublishMenuState} from './askPublishMenu';
import {loadNotPublished} from '../notionRequests/contentPlan';
import {publishFork} from '../publish/publishFork';
import {loadPageBlocks} from '../notionRequests/pageBlocks';
import {loadPageProps} from '../notionRequests/pageProps';
import RawPageContent from '../types/PageContent';
import {resolveSns} from '../helpers/helpers';
import {getFirstImageFromNotionBlocks,} from '../publish/publishHelpers';
import {askPostConfirm} from './askPostConfirm';
import {printImage, printItemDetails, printPublishConfirmData} from '../publish/printInfo';
import {WARN_SIGN} from '../types/constants';
import validateContentPlanPost, {validateContentPlanPostText} from '../publish/validateContentPlanPost';
import {makeClearTextFromNotion} from '../helpers/makeClearTextFromNotion';
import {makeTgPostTextFromNotion} from '../helpers/makeTgPostTextFromNotion';
import {SnType} from '../types/snTypes';
import {PUBLICATION_TYPES} from '../types/publicationType';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  let notPublishedItems: PageObjectResponse[];

  try {
    // load not published records from content plan
    notPublishedItems = await loadNotPublished(blogName,tgChat);
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);
    await tgChat.steps.back();

    return;
  }

  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    let parsedContentItem;
    let parsedPage;

    try {
      parsedContentItem = prepareContentItem(item, tgChat.app.i18n);
      parsedPage = await loadAndPreparePage(parsedContentItem, blogName, tgChat);
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e);
      await tgChat.steps.back();

      return;
    }

    if (!parsedPage && parsedContentItem.type !== PUBLICATION_TYPES.announcement) {
      // if not nested page and it isn't announcement
      await tgChat.reply(tgChat.app.i18n.errors.noNestedPage);
      await tgChat.steps.back();

      return;
    }

    const blogSns = Object.keys(tgChat.app.config.blogs[blogName].sn) as SnType[];
    const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type);
    const clearTexts = makeClearTextFromNotion(
      resolvedSns,
      parsedContentItem.type,
      true,
      tgChat.app.config.blogs[blogName].sn.telegram,
      parsedPage?.textBlocks,
      parsedContentItem.gist,
      parsedPage?.instaTags,
      parsedPage?.tgTags
    );
    let mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);

    mainImgUrl = await printImage(tgChat, mainImgUrl);

    await printItemDetails(blogName, tgChat, clearTexts, resolvedSns, parsedContentItem, parsedPage);
    await askMenu(blogName, tgChat, resolvedSns, parsedContentItem, parsedPage, mainImgUrl);
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
  resolvedSns: SnType[],
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
      state.useFooter,
      tgChat.app.config.blogs[blogName].sn.telegram,
      parsedPage?.textBlocks,
      state.postText,
      state.instaTags,
      parsedPage?.tgTags,
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
        const postTexts = makeTgPostTextFromNotion(
          state.sns,
          state.pubType,
          state.useFooter,
          tgChat.app.config.blogs[blogName].sn.telegram,
          parsedPage?.textBlocks,
          state.postText,
          state.instaTags,
          parsedPage?.tgTags,
        );
        // Do publish
        await publishFork(
          blogName,
          tgChat,
          state,
          parsedContentItem.type,
          postTexts,
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
