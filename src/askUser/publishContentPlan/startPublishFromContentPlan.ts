import TgChat from '../../apiTg/TgChat.js';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints.js';
import {askContentToUse} from './askContentToUse.js';
import {prepareContentItem} from '../../publish/parseContent.js';
import ContentItem from '../../types/ContentItem.js';
import {loadNotPublished} from '../../notionHelpers/requestContentPlan.js';
import {requestPageBlocks} from '../../notionHelpers/requestPageBlocks.js';
import {resolveSns, resolveTgFooter} from '../../helpers/helpers.js';
import {getFirstImageFromNotionBlocks,} from '../../publish/publishHelpers.js';
import {printImage, printContentItemDetails} from '../../publish/printInfo.js';
import {SnType} from '../../types/snTypes.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {startPublicationMenu} from './startPublicationMenu.js';
import {NotionBlocks} from '../../types/notion.js';
import {commonMdToTgHtml} from '../../helpers/commonMdToTgHtml.js';
import {clearMd} from '../../helpers/clearMd.js';
import {makeClearTextsFromNotion} from '../../helpers/makeClearTextsFromNotion.js';


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

    const blogSns = Object.keys(tgChat.app.blogs[blogName].sn) as SnType[];
    const footerTmpl = resolveTgFooter(
      true,
      parsedContentItem.type,
      tgChat.app.blogs[blogName].sn.telegram
    )
    const footerTmplHtml = await commonMdToTgHtml(footerTmpl)
    const cleanFooterTmpl = await clearMd(footerTmpl)
    const resolvedSns = resolveSns(blogSns, parsedContentItem.onlySn, parsedContentItem.type);
    let cleanTexts: Record<SnType, string> | undefined

    // TODO: почему вообще тут это делается???
    if (parsedContentItem.type !== PUBLICATION_TYPES.poll) {
      // make clear text if it isn't a poll
      cleanTexts = makeClearTextsFromNotion(
        resolvedSns,
        parsedContentItem.type,
        true,
        //tgChat.app.blogs[blogName].sn.telegram,
        cleanFooterTmpl,
        pageBlocks,
        //parsedContentItem.gist,
        parsedContentItem.instaTags,
        parsedContentItem.tgTags
      )
    }

    let mainImgUrl = getFirstImageFromNotionBlocks(pageBlocks)
    // if the image wasn't printed then you can set it in page menu
    mainImgUrl = await printImage(tgChat, mainImgUrl)
    await printContentItemDetails(tgChat, resolvedSns, parsedContentItem, footerTmplHtml, cleanTexts)
    await startPublicationMenu(blogName, tgChat, resolvedSns, parsedContentItem, pageBlocks, mainImgUrl)
  }));
}
