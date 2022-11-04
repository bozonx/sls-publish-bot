import ContentItem from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import TgChat from '../apiTg/TgChat';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd';
import {prepareFooterPost} from '../helpers/helpers';
import {publishPreparedPostTg} from './publishHelpers';

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
    postStr += prepareFooterPost(
      tgChat.app.config.blogs[blogName].sn.telegram?.postFooter,
      parsedPage.tgTags
    )
  }

  await publishPreparedPostTg(
    contentItem.date,
    resolvedTime,
    postStr,
    blogName,
    tgChat,
    true
  );
}