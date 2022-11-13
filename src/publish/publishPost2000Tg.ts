

// TODO: remove


import ContentItem from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import TgChat from '../apiTg/TgChat';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd';
import {prepareFooter} from '../helpers/helpers';
import {publishPostNoImageTg} from './publishHelpers';

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