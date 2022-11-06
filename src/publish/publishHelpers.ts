import moment from 'moment';
import {publishTgImage, publishTgPost} from '../apiTg/publishTgPost';
import {FULL_DATE_FORMAT} from '../types/constants';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import {SN_TYPES} from '../types/ContentItem';
import TgChat from '../apiTg/TgChat';
import {makeUtcOffsetStr} from '../helpers/helpers';


export async function publishPreparedPostTg(
  resolvedDate: string,
  resolvedTime: string,
  postStr: string,
  blogName: string,
  tgChat: TgChat,
  allowPreview: boolean
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgPost(
      tgChat.app.config.logChannelId,
      postStr,
      blogName,
      tgChat,
      !allowPreview
    );

    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.config.logChannelId,
      makePublishInfoMessage(resolvedDate, resolvedTime, blogName, tgChat),
      {
        reply_to_message_id: msgId,
      }
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish prepared post to telegram to log channel`);

    throw e;
  }

  await registerTaskTg(resolvedDate, resolvedTime, msgId, blogName, tgChat);
}

export async function publishImageTg(
  resolvedDate: string,
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
      makePublishInfoMessage(resolvedDate, resolvedTime, blogName, tgChat),
      {
        reply_to_message_id: msgId,
      }
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish prepared post to telegram to log channel`);

    throw e;
  }


  await registerTaskTg(resolvedDate, resolvedTime, msgId, blogName, tgChat);
}

async function registerTaskTg(
  resolvedDate: string,
  resolvedTime: string,
  msgId: number,
  blogName: string,
  tgChat: TgChat,
) {
  // get id of channel to publish postpone post
  const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;
  const startTime = moment(`${moment(resolvedDate).format('YYYY-MM-DD')}T${resolvedTime}:00`)
    .utcOffset(tgChat.app.appConfig.utcOffset).format();

  console.log(11111, startTime, resolvedDate)

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

function makePublishInfoMessage(
  resolvedDate: string,
  resolvedTime: string,
  blogName: string,
  tgChat: TgChat,
): string {
  // TODO: отформатировать почеловечи
  return tgChat.app.i18n.message.prePublishInfo
  + tgChat.app.config.blogs[blogName].dispname + ', '
    // TODO: add sn
  + resolvedDate + ' ' + resolvedTime + ' ' + makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
}
