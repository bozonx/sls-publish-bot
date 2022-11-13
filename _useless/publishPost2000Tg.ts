

// TODO: remove


import ContentItem from '../src/types/ContentItem';
import RawPageContent from '../src/types/PageContent';
import TgChat from '../src/apiTg/TgChat';
import {transformNotionToTelegramPostMd} from '../src/helpers/transformNotionToTelegramPostMd';
import {prepareFooter} from '../src/helpers/helpers';
import {publishPostNoImageTg} from '../src/publish/publishHelpers';

// TODO: сделать текстом + картинка предпросмотром - точку сделать ссылкой
// TODO: превью обязательно



export async function publishPost2000Tg(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat,
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

  await publishPostNoImageTg(
    contentItem.date,
    resolvedTime,
    postStr,
    blogName,
    tgChat,
    true
  );
}