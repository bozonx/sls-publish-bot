import moment from 'moment';
import TgChat from '../apiTg/TgChat';
import {makeUtcOffsetStr} from '../helpers/helpers';
import {PRINT_FULL_DATE_FORMAT} from '../types/constants';
import ru from '../I18n/ru';
import {SN_TYPES, SnType} from '../types/snTypes';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import {NOTION_BLOCKS} from '../types/notion';
import {ROOT_LEVEL_BLOCKS} from '../notionRequests/pageBlocks';


// TODO: review


export function getFirstImageFromNotionBlocks(blocks?: NOTION_BLOCKS): string | undefined {
  if (!blocks) return;

  for (const item of blocks[ROOT_LEVEL_BLOCKS]) {
    if (item.type === 'image') return (item.image as any).file.url;
  }
}

export async function registerTaskTg(
  isoDate: string,
  resolvedTime: string,
  msgId: number,
  blogName: string,
  tgChat: TgChat,
) {
  // get id of channel to publish postpone post
  const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;
  const startTime = moment(`${isoDate}T${resolvedTime}:00`)
    .utcOffset(tgChat.app.appConfig.utcOffset).format();

  if (!chatId) {
    throw new Error(`Telegram chat id doesn't set`);
  }

  const task: PostponePostTask = {
    //startTime: '2022-11-01T19:58:00+03:00',
    startTime,
    type: TASK_TYPES.postponePost,
    chatId,
    //blogUname: blogName,
    sn: SN_TYPES.telegram as 'telegram',
    forwardMessageId: msgId,
  };

  await tgChat.app.tasks.addTask(task);
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
