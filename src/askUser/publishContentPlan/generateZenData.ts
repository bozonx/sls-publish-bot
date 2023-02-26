import TgChat from '../../apiTg/TgChat.js';
import {ContentItemState} from './startPublicationMenu.js';
import ContentItem from '../../types/ContentItem.js';
import {NotionBlocks} from '../../types/notion.js';
import {trimPageBlocks} from '../../helpers/convertHelpers.js';
import {convertCommonMdToTgHtml} from '../../helpers/convertCommonMdToTgHtml.js';
import {convertNotionToHtml} from '../../helpers/convertNotionToHast.js';


export async function generateZenData(
  blogName: string,
  tgChat: TgChat,
  item: ContentItem,
  state: ContentItemState,
  pageBlocks?: NotionBlocks,
  mainImgUrl?: string
): Promise<Record<string, any>> {
  const footerStr = (item.type === 'article')
    ? tgChat.app.blogs[blogName].sn.zen?.articleFooter
    : tgChat.app.blogs[blogName].sn.zen?.postFooter
  const trimmedArticle = trimPageBlocks(pageBlocks!)
  let contentHtml = await convertNotionToHtml(
    trimmedArticle,
    undefined,
    true
  )

  console.log(1111, contentHtml)

  if (footerStr) {
    const footerHtml = convertCommonMdToTgHtml(footerStr)

    console.log(2222, footerHtml)

    contentHtml += '<br />' + footerHtml
  }

  console.log(3333, contentHtml)

  return {
    title: item.nameGist,
    mainImgUrl,
    content: contentHtml,
  }
}
