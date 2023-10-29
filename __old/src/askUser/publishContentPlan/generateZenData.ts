import _ from 'lodash';
import TgChat from '../../apiTg/TgChat';
import {ContentItemState} from './startPublicationMenu';
import ContentItem from '../../types/ContentItem';
import {NotionBlocks} from '../../types/notion';
import {trimPageBlocks} from '../../helpers/convertHelpers';
import {convertNotionToHtml} from '../../helpers/convertNotionToHast';


export async function generateZenData(
  blogName: string,
  tgChat: TgChat,
  item: ContentItem,
  state: ContentItemState,
  pageBlocks?: NotionBlocks,
  mainImgUrl?: string
): Promise<Record<string, any>> {
  const footerHtml = (item.type === 'article')
    ? tgChat.app.blogs[blogName].sn.zen?.articleFooter
    : tgChat.app.blogs[blogName].sn.zen?.postFooter
  const trimmedArticle = trimPageBlocks(pageBlocks!)
  let contentHtml = await convertNotionToHtml(
    trimmedArticle,
    undefined,
    true,
    true,
  )

  if (footerHtml) {
    contentHtml += _.trim(footerHtml)
  }

  return {
    title: item.nameGist,
    mainImgUrl,
    content: contentHtml,
  }
}
