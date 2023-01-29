import TgChat from '../../apiTg/TgChat.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import {askContentToUse} from './askContentToUse.js';
import {prepareContentItem} from '../../publish/parseContent.js';
import ContentItem from '../../types/ContentItem.js';
import {loadNotPublished} from '../../notionHelpers/requestContentPlan.js';
import {requestPageBlocks} from '../../notionHelpers/requestPageBlocks.js';
import {resolveSns} from '../../helpers/helpers.js';
import {getFirstImageFromNotionBlocks,} from '../../publish/publishHelpers.js';
import {printImage, printContentItemDetails} from '../../publish/printInfo.js';
import {SnType} from '../../types/snTypes.js';
import {makeClearTextFromNotion} from '../../helpers/makeClearTextFromNotion.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {startPublicationMenu} from './startPublicationMenu.js';
import {NotionBlocks} from '../../types/notion.js';


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
    let pageBlocks: NotionBlocks

    try {
      parsedContentItem = prepareContentItem(item, tgChat.app.i18n)
      pageBlocks = await requestPageBlocks(item.id, tgChat)
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
      await tgChat.steps.back()

      return
    }

    // TODO: почему вообще тут это делается???
    const blogSns = Object.keys(tgChat.app.blogs[blogName].sn) as SnType[];
    // TODO: почему вообще тут это делается???
    const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type);
    //let clearTexts: Record<SnType, string> | undefined

    // // TODO: почему вообще тут это делается???
    // if (parsedContentItem.type !== PUBLICATION_TYPES.poll) {
    //   // make clear text if it isn't a poll
    //   clearTexts = makeClearTextFromNotion(
    //     resolvedSns,
    //     parsedContentItem.type,
    //     true,
    //     tgChat.app.blogs[blogName].sn.telegram,
    //     pageBlocks,
    //     parsedContentItem.gist,
    //     parsedContentItem.instaTags,
    //     parsedContentItem.tgTags
    //   )
    // }


    let mainImgUrl = getFirstImageFromNotionBlocks(pageBlocks)
    // if the image wasn't printed then you can set it in page menu
    mainImgUrl = await printImage(tgChat, mainImgUrl)
    await printContentItemDetails(blogName, tgChat, resolvedSns, parsedContentItem, undefined)
    await startPublicationMenu(blogName, tgChat, resolvedSns, parsedContentItem, pageBlocks, mainImgUrl)
  }));
}
