import TgChat from '../../apiTg/TgChat.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import {askContentToUse} from './askContentToUse.js';
import {prepareContentItem} from '../../publish/parseContent.js';
import ContentItem from '../../types/ContentItem.js';
import {loadNotPublished} from '../../contentPlan/requestContentPlan.js';
import {requestPageBlocks} from '../../apiNotion/requestPageBlocks.js';
import {resolvePostFooter, resolveSns} from '../../helpers/helpers.js';
import {getFirstImageFromNotionBlocks,} from '../../publish/publishHelpers.js';
import {printImage, printContentItemInitialDetails} from '../../publish/printContentItemInfo.js';
import {SnType} from '../../types/snTypes.js';
import {startPublicationMenu} from './startPublicationMenu.js';
import {NotionBlocks} from '../../types/notion.js';
import _ from 'lodash';
import {WARN_SIGN} from '../../types/constants.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';


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
      pageBlocks = await requestPageBlocks(item.id, tgChat.app.notion)
    }
    catch (e) {
      await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
      await tgChat.steps.back()

      return
    }

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

    // const snsForCheck: SnType[] = (parsedContentItem.onlySn?.length)
    //   ? parsedContentItem.onlySn
    //   : Object.keys(SN_SUPPORT_TYPES) as SnType[]
    // // warn if publication type doesn't supported by sn
    // for (const sn of snsForCheck) {
    //   if (SN_SUPPORT_TYPES[sn].indexOf(parsedContentItem.type) === -1) {
    //     await tgChat.reply(WARN_SIGN + ' ' + _.template(tgChat.app.i18n.errors.unsupportedPubType)({
    //       SN: sn,
    //       PUB_TYPE: parsedContentItem.type,
    //     }))
    //   }
    // }

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
