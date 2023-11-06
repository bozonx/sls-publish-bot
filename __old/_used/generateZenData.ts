import _ from 'lodash';
import TgChat from '../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/TgChat';
import {ContentItemState} from '../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/askUser/publishContentPlan/startPublicationMenu';
import ContentItem from '../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/ContentItem';
import {NotionBlocks} from '../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/notion';
import {trimPageBlocks} from '../src/helpers/convertHelpers';
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
