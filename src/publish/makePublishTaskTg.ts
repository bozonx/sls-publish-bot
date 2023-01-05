import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {publishTgCopy, publishTgImage, publishTgPoll, publishTgText, publishTgVideo} from '../apiTg/publishTg.js';
import {makePublishInfoMessage} from './publishHelpers.js';
import {PostponeTgPostTask, TASK_TYPES} from '../types/TaskItem.js';
import {SN_TYPES} from '../types/snTypes.js';
import PollData from '../types/PollData.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';


/**
 * Post only text to telegram, without image
 */
export async function makePublishTaskTgOnlyText(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  postStr: string,
  allowPreview: boolean,
  urlBtn?: TgReplyBtnUrl,
  autoDeleteIsoDateTime?: string
) {
  let postMsgId: number;
  // Print to log channel
  try {
    postMsgId = await publishTgText(
      tgChat.app.appConfig.logChannelId,
      postStr,
      tgChat,
      allowPreview,
      urlBtn
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, time, postMsgId, blogName, tgChat, autoDeleteIsoDateTime);
}

/**
 * Post image to telegram
 */
export async function makePublishTaskTgImage(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  imageUrl: string,
  captionMd?: string,
  urlBtn?: TgReplyBtnUrl,
  autoDeleteIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgImage(
      tgChat.app.appConfig.logChannelId,
      imageUrl,
      tgChat,
      captionMd,
      urlBtn
    )
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, time, msgId, blogName, tgChat, autoDeleteIsoDateTime);
}

/**
 * Post image to telegram
 */
export async function makePublishTaskTgVideo(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  videoId: string,
  captionMd?: string,
  urlBtn?: TgReplyBtnUrl,
  autoDeleteIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgVideo(
      tgChat.app.appConfig.logChannelId,
      videoId,
      tgChat,
      captionMd,
      urlBtn
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, time, msgId, blogName, tgChat, autoDeleteIsoDateTime);
}

/**
 * Copy message to telegram chat. Useful for poll.
 */
export async function makePublishTaskTgCopy(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  resolvedTime: string,
  messageId: number,
  autoDeleteIsoDateTime?: string
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

  await registerPublishTaskTg(isoDate, resolvedTime, msgId, blogName, tgChat, autoDeleteIsoDateTime);
}

export async function makePublishTaskTgPoll(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  pollData: PollData,
  autoDeleteIsoDateTime?: string
) {
  let postMsgId: number;
  // Print to log channel
  try {
    postMsgId = await publishTgPoll(tgChat.app.appConfig.logChannelId, pollData, tgChat);
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish poll to telegram to log channel`);
  }

  await registerPublishTaskTg(isoDate, time, postMsgId, blogName, tgChat, autoDeleteIsoDateTime);
}

export async function registerPublishTaskTg(
  isoDate: string,
  time: string,
  postMsgId: number,
  blogName: string,
  tgChat: TgChat,
  autoDeleteIsoDateTime?: string
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
  const chatId = tgChat.app.blogs[blogName].sn.telegram?.channelId;
  // TODO: а чё без часового пояса???
  // moment(`${isoDate} ${time}`).utcOffset(tgChat.app.appConfig.utcOffset).format()
  const startTime = moment(`${isoDate}T${time}:00`)
    .utcOffset(tgChat.app.appConfig.utcOffset).format();

  if (!chatId) {
    await tgChat.reply(tgChat.app.i18n.errors.noChannel);

    throw new Error(`Telegram chat id doesn't set`);
  }

  const task: PostponeTgPostTask = {
    // time like '2022-11-01T19:58:00+03:00'
    startTime,
    type: TASK_TYPES.postponePost,
    chatId,
    sn: SN_TYPES.telegram as 'telegram',
    forwardMessageId: postMsgId,
  };

  await tgChat.app.tasks.addTaskAndLog(task);
}
