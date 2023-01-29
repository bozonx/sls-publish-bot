import TgChat from '../../apiTg/TgChat.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import {askContentToUse} from './askContentToUse.js';
import {prepareContentItem} from '../../publish/parseContent.js';
import ContentItem from '../../types/ContentItem.js';
import {preparePage} from '../../notionHelpers/parsePage.js';
import {loadNotPublished} from '../../notionHelpers/requestContentPlan.js';
import {loadPageBlocks} from '../../notionHelpers/requestPageBlocks.js';
import {loadPageProps} from '../../notionHelpers/requestPageProps.js';
import RawPageContent from '../../types/PageContent.js';
import {resolveSns} from '../../helpers/helpers.js';
import {getFirstImageFromNotionBlocks,} from '../../publish/publishHelpers.js';
import {printImage, printItemDetails} from '../../publish/printInfo.js';
import {makeClearTextFromNotion} from '../../helpers/makeClearTextFromNotion.js';
import {SnType} from '../../types/snTypes.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {startPublicationMenu} from './startPublicationMenu.js';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  let notPublishedItems: PageObjectResponse[]

  try {
    // load not published records from content plan
    notPublishedItems = await loadNotPublished(blogName,tgChat)
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
    await tgChat.steps.back()

    return
  }

  // ask use select not published item
  await askContentToUse(notPublishedItems, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    let parsedContentItem: ContentItem
    let parsedPage: RawPageContent | undefined

    try {
      parsedContentItem = prepareContentItem(item, tgChat.app.i18n)
      parsedPage = await loadAndPreparePage(parsedContentItem, blogName, tgChat)
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
      await tgChat.steps.back()

      return
    }

    // TODO: review
    if (!parsedPage && parsedContentItem.type !== PUBLICATION_TYPES.announcement) {
      // if not nested page and it isn't announcement
      await tgChat.reply(tgChat.app.i18n.errors.noNestedPage);
      await tgChat.steps.back();

      return;
    }

    const blogSns = Object.keys(tgChat.app.blogs[blogName].sn) as SnType[];
    const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type);
    let clearTexts: Record<SnType, string> | undefined

    // TODO: почему вообще тут это делается???
    if (parsedContentItem.type !== PUBLICATION_TYPES.poll) {
      // make clear text if it isn't a poll
      clearTexts = makeClearTextFromNotion(
        resolvedSns,
        parsedContentItem.type,
        true,
        tgChat.app.blogs[blogName].sn.telegram,
        parsedPage?.textBlocks,
        parsedContentItem.gist,
        parsedPage?.instaTags,
        parsedPage?.tgTags
      )
    }

    let mainImgUrl = getFirstImageFromNotionBlocks(parsedPage?.textBlocks);
    // if the image wasn't printed then you can set it in page menu
    mainImgUrl = await printImage(tgChat, mainImgUrl);

    await printItemDetails(blogName, tgChat, resolvedSns, parsedContentItem, clearTexts, parsedPage)
    await startPublicationMenu(blogName, tgChat, resolvedSns, parsedContentItem, parsedPage, mainImgUrl)
  }));
}


async function loadAndPreparePage(
  parsedContentItem: ContentItem,
  blogName: string,
  tgChat: TgChat
): Promise<RawPageContent | undefined> {
  // TODO: remove relativePageId
  if (!parsedContentItem.relativePageId) return;
  // load props of page from notion
  const pageProperties = await loadPageProps(parsedContentItem.relativePageId, tgChat);
  // load all the page blocks from notion
  const pageContent = await loadPageBlocks(parsedContentItem.relativePageId, tgChat);

  return preparePage(parsedContentItem.type, pageProperties, pageContent, tgChat.app.i18n);
}
