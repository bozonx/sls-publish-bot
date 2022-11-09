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
import {printItemDetails, printPublishConfirmData} from './printInfo';


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

    // TODO: если не получилось распознать картинку - то нужно запретить публикацию
    // TODO: если не совпадает тип публикации с поддержкой соц сетью - то запретить публикацию

    const disableOk = !resolvedSns.length;

    await printPublishConfirmData(blogName, tgChat, resolvedSns, state, parsedPage);

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
    }), disableOk);
  }));
}
