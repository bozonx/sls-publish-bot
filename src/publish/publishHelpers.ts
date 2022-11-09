import moment from 'moment';
import {publishTgImage, publishTgPostNoImage} from '../apiTg/publishTgPost';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import {SN_TYPES} from '../types/ContentItem';
import TgChat from '../apiTg/TgChat';
import {clearMdText, makeTagsString, makeUtcOffsetStr} from '../helpers/helpers';
import {PRINT_FULL_DATE_FORMAT} from '../types/constants';
import {NOTION_BLOCKS} from '../types/types';
import {ROOT_LEVEL_BLOCKS} from '../notionRequests/pageBlocks';
import {transformNotionToCleanText} from '../helpers/transformNotionToCleanText';
import ru from '../I18n/ru';
import RawPageContent from '../types/PageContent';


/**
 * Post without image
 */
export async function publishPostNoImageTg(
  isoDate: string,
  resolvedTime: string,
  postStr: string,
  blogName: string,
  tgChat: TgChat,
  allowPreview: boolean
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgPostNoImage(
      tgChat.app.config.logChannelId,
      postStr,
      blogName,
      tgChat,
      !allowPreview
    );

    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.config.logChannelId,
      makePublishInfoMessage(isoDate, resolvedTime, blogName, tgChat),
      {
        reply_to_message_id: msgId,
      }
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish prepared post to telegram to log channel`);

    throw e;
  }

  await registerTaskTg(isoDate, resolvedTime, msgId, blogName, tgChat);
}

export async function publishImageTg(
  isoDate: string,
  resolvedTime: string,
  imageUrl: string,
  blogName: string,
  tgChat: TgChat,
  captionMd?: string,
) {
  let msgId: number;
  // Print to log channel
  try {

    // TODO: сделать поддержку нескольких картинок

    msgId = await publishTgImage(
      tgChat.app.config.logChannelId,
      imageUrl,
      blogName,
      tgChat,
      captionMd
    )

    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.config.logChannelId,
      makePublishInfoMessage(isoDate, resolvedTime, blogName, tgChat),
      {
        reply_to_message_id: msgId,
      }
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish prepared post to telegram to log channel`);

    throw e;
  }


  await registerTaskTg(isoDate, resolvedTime, msgId, blogName, tgChat);
}

export function getFirstImageFromNotionBlocks(blocks?: NOTION_BLOCKS): string | undefined {
  if (!blocks) return;

  for (const item of blocks[ROOT_LEVEL_BLOCKS]) {
    if (item.type === 'image') return (item.image as any).file.url;
  }
}


async function registerTaskTg(
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
    blogUname: blogName,
    sn: SN_TYPES.telegram,
    forwardMessageId: msgId,
  };

  await tgChat.app.tasks.addTask(task);
}

export function makeContentLengthString(
  i18n: typeof ru,
  textBlocks?: NOTION_BLOCKS,
  tgTags?: string[],
  instaTags?: string[],
  tgFooter?: string,
): string {
  if (!textBlocks) return '';

  const instaTagsStr = makeTagsString(instaTags);
  const cleanText = transformNotionToCleanText(textBlocks);
  const cleanFooter = clearMdText(tgFooter || '');
  const instaLength = (cleanText + '\n\n' + instaTagsStr).length;
  const tgLength = (cleanText + cleanFooter).length;

  return ''
    + `${i18n.pageInfo.contentLength}: ${cleanText.length}\n`
    + `${i18n.pageInfo.contentLengthWithTgFooter}: ${tgLength}\n`
    + `${i18n.pageInfo.contentLengthWithInstaTags}: ${instaLength}`;
}

export async function makePost2000Text(tgChat: TgChat, rawText: string, img?: string) {

  // TODO: сохранить картинку в telegra.ph
  // TODO: получить ссылку на неё
  // TODO: эту ссылку добавить в первую точку

  return rawText;
}


function makePublishInfoMessage(
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

