import TgChat from '../../apiTg/TgChat';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import {askContentToUse} from './askContentToUse';
import {prepareContentItem} from '../../contentPlan/parseContent';
import ContentItem from '../../types/ContentItem';
import {requestPageBlocks} from '../../apiNotion/requestPageBlocks';
import {resolvePostFooter, resolveSns} from '../../helpers/helpers';
import {getFirstImageFromNotionBlocks,} from '../../helpers/publishHelpers';
import {printImage, printContentItemInitialDetails} from '../../contentPlan/printContentItemInfo';
import {SnType} from '../../types/snTypes';
import {startPublicationMenu} from './startPublicationMenu';
import {NotionBlocks} from '../../types/notion';
import {WARN_SIGN} from '../../types/constants';
import {PUBLICATION_TYPES} from '../../types/publicationType';


export async function startPublishFromContentPlan(blogName: string, tgChat: TgChat) {
  // ask use select not published item
  await askContentToUse(blogName, tgChat, tgChat.asyncCb(async (item: PageObjectResponse) => {
    let parsedContentItem: ContentItem
    let pageBlocks: NotionBlocks | undefined

    try {
      parsedContentItem = prepareContentItem(item, tgChat.app.i18n)
      pageBlocks = await requestPageBlocks(item.id, tgChat.app.notion)

      if (!pageBlocks.length) pageBlocks = undefined
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
      await tgChat.steps.back()

      return
    }

    //console.log(JSON.stringify(pageBlocks, null, 2))

    if (parsedContentItem.type === PUBLICATION_TYPES.article && !pageBlocks) {
      await tgChat.reply(WARN_SIGN + ' ' + tgChat.app.i18n.errors.articleNeedText)
      await tgChat.steps.back()

      return
    }

    const blogSns = Object.keys(tgChat.app.blogs[blogName].sn) as SnType[];
    const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type)
    const availableTgFooter = Boolean(resolvePostFooter(parsedContentItem.type, tgChat.app.blogs[blogName].sn.telegram))
    let mainImgUrl = getFirstImageFromNotionBlocks(pageBlocks)
    // if the image wasn't printed then you can set it in page menu
    mainImgUrl = await printImage(tgChat, mainImgUrl)

    await printContentItemInitialDetails(
      tgChat,
      blogName,
      resolvedSns,
      parsedContentItem,
      availableTgFooter,
      pageBlocks,
      parsedContentItem.instaTags
    )
    await startPublicationMenu(
      blogName,
      tgChat,
      resolvedSns,
      availableTgFooter,
      parsedContentItem,
      pageBlocks,
      mainImgUrl
    )
  }))
}
