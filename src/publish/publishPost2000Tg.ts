import ContentItem from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import TgChat from '../apiTg/TgChat';

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


}