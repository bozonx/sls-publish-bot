import TgChat from '../../src/apiTg/TgChat';
import ContentItem, {SN_TYPES} from '../../src/types/ContentItem';
import RawPageContent from '../src/types/PageContent';
import {transformNotionToTelegramPostMd} from '../src/helpers/transformNotionToTelegramPostMd';
import {prepareFooter} from '../../src/helpers/helpers';
import {publishImageTg, publishPostNoImageTg} from '../src/publish/publishHelpers';


export async function publishPost1000Tg(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat,
  allowPreview: boolean,
  allowFooter: boolean,
  correctedTime?: string,
) {
  const resolvedTime = (correctedTime) ? correctedTime : contentItem.time;
  let postStr = transformNotionToTelegramPostMd(parsedPage.textBlocks);

  if (allowFooter) {
    postStr += prepareFooter(
      tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
      parsedPage.tgTags
      // TODO: add useFooter
    )
  }

  if (parsedPage.imageUrl) {
    await publishImageTg(
      contentItem.date,
      resolvedTime,
      parsedPage.imageUrl,
      blogName,
      tgChat,
      postStr
    );
  }
  else {
    await publishPostNoImageTg(
      contentItem.date,
      resolvedTime,
      postStr,
      blogName,
      tgChat,
      allowPreview
    );
  }
}
