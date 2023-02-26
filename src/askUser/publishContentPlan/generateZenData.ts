import TgChat from '../../apiTg/TgChat.js';
import {ContentItemState} from './startPublicationMenu.js';
import ContentItem from '../../types/ContentItem.js';
import {NotionBlocks} from '../../types/notion.js';
import {convertNotionToTgHtml} from '../../helpers/convertNotionToTgHtml.js';


export async function generateZenData(
  blogName: string,
  tgChat: TgChat,
  item: ContentItem,
  state: ContentItemState,
  pageBlocks?: NotionBlocks,
  mainImgUrl?: string
): Promise<Record<string, any>> {

  // TODO: add zen footer
  // TODO: поддержка поста

  return {
    title: item.nameGist,
    mainImgUrl,
    content: pageBlocks && convertNotionToTgHtml(pageBlocks),
  }
}
