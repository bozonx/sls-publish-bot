import moment from 'moment';
import TgChat from '../apiTg/TgChat';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {PRINT_FULL_DATE_FORMAT} from '../types/constants';
import ru from '../I18n/ru';
import {SN_TYPES, SnType} from '../types/snTypes';
import {NotionBlocks} from '../types/notion';
import {ROOT_LEVEL_BLOCKS} from '../notionRequests/pageBlocks';


// TODO: review


export function getFirstImageFromNotionBlocks(blocks?: NotionBlocks): string | undefined {
  if (!blocks) return;

  for (const item of blocks[ROOT_LEVEL_BLOCKS]) {
    if (item.type === 'image') return (item.image as any).file.url;
  }
}

export function makeContentLengthString(
  i18n: typeof ru,
  clearTexts: Record<SnType, string>,
  instaTags?: string[],
  tgFooter?: string,
): string {
  let result = `${i18n.pageInfo.contentLength}: ${clearTexts[SN_TYPES.site].length}\n`;

  if (tgFooter) result += `${i18n.pageInfo.contentLengthWithTgFooter}: `
   + `${clearTexts[SN_TYPES.telegram].length}\n`;

  if (instaTags && instaTags.length) {
    result += `${i18n.pageInfo.contentLengthWithInstaTags}: `
        + `${clearTexts[SN_TYPES.instagram].length}\n`
      + `${i18n.pageInfo.instaTagsCount}: ` + (instaTags || []).length;
  }

  return result;
}

export async function makePost2000Text(tgChat: TgChat, rawText: string, img?: string) {

  // TODO: сохранить картинку в telegra.ph
  // TODO: получить ссылку на неё
  // TODO: эту ссылку добавить в первую точку

  return rawText;
}

export function makePublishInfoMessage(
  isoDate: string,
  resolvedTime: string,
  blogName: string,
  tgChat: TgChat,
): string {
  // TODO: отформатировать почеловечи
  return tgChat.app.i18n.message.prePublishInfo
    + tgChat.app.config.blogs[blogName].dispname + ', '
    // TODO: add sn
    + moment(isoDate).format(PRINT_FULL_DATE_FORMAT) + ' ' + resolvedTime + ' ' + makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
}
