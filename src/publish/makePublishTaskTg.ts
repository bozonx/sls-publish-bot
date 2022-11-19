import TgChat from '../apiTg/TgChat';
import {publishTgCopy, publishTgImage, publishTgText} from '../apiTg/publishTg';
import {makePublishInfoMessage} from './publishHelpers';
import moment from 'moment/moment';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import {SN_TYPES} from '../types/snTypes';


/**
 * Post only text to telegram, without image
 */
export async function makePublishTaskTgOnlyText(
  isoDate: string,
  time: string,
  postStr: string,
  blogName: string,
  tgChat: TgChat,
  allowPreview: boolean
) {
  let postMsgId: number;
  // Print to log channel
  try {
    postMsgId = await publishTgText(
      tgChat.app.appConfig.logChannelId,
      postStr,
      tgChat,
      allowPreview
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, time, postMsgId, blogName, tgChat);
}

/**
 * Post image to telegram
 */
export async function makePublishTaskTgImage(
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
    msgId = await publishTgImage(
      tgChat.app.appConfig.logChannelId,
      imageUrl,
      tgChat,
      captionMd
    )
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, resolvedTime, msgId, blogName, tgChat);
}

/**
 * Copy message to telegram chat. Useful for poll.
 */
export async function makePublishTaskTgCopy(
  isoDate: string,
  resolvedTime: string,
  messageId: number,
  blogName: string,
  tgChat: TgChat
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgCopy(
      tgChat.app.appConfig.logChannelId,
      tgChat.botChatId,
      messageId,
      tgChat
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, resolvedTime, msgId, blogName, tgChat);
}


export async function registerPublishTaskTg(
  isoDate: string,
  time: string,
  postMsgId: number,
  blogName: string,
  tgChat: TgChat,
) {
  try {
    // send info message
    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.appConfig.logChannelId,
      makePublishInfoMessage(isoDate, time, blogName, tgChat),
      {
        reply_to_message_id: postMsgId,
      }
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }
  // get id of channel to publish postpone post
  const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;
  const startTime = moment(`${isoDate}T${time}:00`)
    .utcOffset(tgChat.app.appConfig.utcOffset).format();

  if (!chatId) {
    await tgChat.reply(tgChat.app.i18n.errors.noChannel);

    throw new Error(`Telegram chat id doesn't set`);
  }

  const task: PostponePostTask = {
    // time like '2022-11-01T19:58:00+03:00'
    startTime,
    type: TASK_TYPES.postponePost,
    chatId,
    sn: SN_TYPES.telegram as 'telegram',
    forwardMessageId: postMsgId,
  };

  await tgChat.app.tasks.addTask(task);
}
