import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {
  publishTgCopy,
  publishTgImage,
  publishTgMediaGroup,
  publishTgPoll,
  publishTgText,
  publishTgVideo
} from '../apiTg/publishTg.js';
import {makePost2000Text, makePublishInfoMessage, resolveImageUrl} from './publishHelpers.js';
import {PostponeTgPostTask, TASK_TYPES} from '../types/TaskItem.js';
import {SN_TYPES} from '../types/snTypes.js';
import PollData from '../types/PollData.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';
import {PhotoData, PhotoUrlData, VideoData} from '../types/MessageEvent.js';
import {PrimitiveMediaGroup} from '../types/types.js';


/**
 * Register custom post creating task
 */
export async function registerTgPost(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  resultTextHtml: string,
  postAsText: boolean,
  usePreview: boolean,
  mediaGroup: (PhotoData | PhotoUrlData | VideoData)[],
  urlBtn?: TgReplyBtnUrl,
  autoDeleteIsoDateTime?: string
) {
  if (postAsText) {
    // post as only text
    const imgUrl: string | undefined = resolveImageUrl(mediaGroup)
    const post2000Txt = await makePost2000Text(tgChat, resultTextHtml, imgUrl);

    await makePublishTaskTgOnlyText(
      blogName,
      tgChat,
      isoDate,
      time,
      post2000Txt,
      (imgUrl) ? true : usePreview,
      urlBtn,
      autoDeleteIsoDateTime
    );
  }
  else if (mediaGroup.length > 1) {
    // post several images
    await makePublishTaskTgMediaGroup(
      blogName,
      tgChat,
      isoDate,
      time,
      mediaGroup,
      resultTextHtml,
      autoDeleteIsoDateTime
    );
  }
  else {
    // post as image or video caption
    if (mediaGroup[0].type === 'video') {
      if (!mediaGroup[0].fileId) throw new Error(`No video fileId`);

      await makePublishTaskTgVideo(
        blogName,
        tgChat,
        isoDate,
        time,
        mediaGroup[0].fileId,
        resultTextHtml,
        urlBtn,
        autoDeleteIsoDateTime
      );
    }
    else {
      const imgUrl: string | undefined = resolveImageUrl(mediaGroup)

      if (!imgUrl) throw new Error(`No image`);

      await makePublishTaskTgImage(
        blogName,
        tgChat,
        isoDate,
        time,
        imgUrl,
        resultTextHtml,
        urlBtn,
        autoDeleteIsoDateTime
      );
    }
  }

  await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
}

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
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgText(
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      postStr,
      allowPreview,
      urlBtn
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(tgChat, blogName, isoDate, time, msgId, urlBtn, autoDeleteIsoDateTime);
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
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      imageUrl,
      captionMd,
      urlBtn
    )
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(tgChat, blogName, isoDate, time, msgId, urlBtn, autoDeleteIsoDateTime);
}

/**
 * Copy message to telegram chat. Useful for poll.
 */
export async function makePublishTaskTgCopy(
  blogName: string,
  tgChat: TgChat,
  // TODO: может сразу готовую дату принимать?
  isoDate: string,
  resolvedTime: string,
  messageId: number,
  autoDeleteIsoDateTime?: string,
  closePollIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgCopy(
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      tgChat.botChatId,
      messageId
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(
    tgChat,
    blogName,
    isoDate,
    resolvedTime,
    msgId,
    undefined,
    autoDeleteIsoDateTime,
    closePollIsoDateTime
  );
}

export async function makePublishTaskTgPoll(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  pollData: PollData,
  autoDeleteIsoDateTime?: string,
  closePollIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgPoll(tgChat.app, tgChat.app.appConfig.logChannelId, pollData);
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish poll to telegram to log channel`);
  }

  await registerPublishTaskTg(
    tgChat,
    blogName,
    isoDate,
    time,
    msgId,
    undefined,
    autoDeleteIsoDateTime,
    closePollIsoDateTime
  );
}


/**
 * Post image to telegram
 */
async function makePublishTaskTgVideo(
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
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      videoId,
      captionMd,
      urlBtn
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(tgChat, blogName, isoDate, time, msgId, urlBtn, autoDeleteIsoDateTime);
}

/**
 * Post media group to telegram
 */
async function makePublishTaskTgMediaGroup(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  mediaGroup: (PhotoData | PhotoUrlData | VideoData)[],
  captionMd?: string,
  autoDeleteIsoDateTime?: string
) {
  let msgIds: number[];
  // Print to log channel
  try {
    msgIds = await publishTgMediaGroup(
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      mediaGroup,
      captionMd
    )
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(
    tgChat,
    blogName,
    isoDate,
    time,
    msgIds[0],
    undefined,
    autoDeleteIsoDateTime,
    undefined,
    captionMd,
    mediaGroup.map((e) => {
      return {
        type: (e.type === 'video') ? 'video' : 'photo',
        url: (e as any).fileId || (e as any).url
      }
    })
  );
}

async function registerPublishTaskTg(
  tgChat: TgChat,
  blogName: string,
  isoDate: string,
  time: string,
  messageIdToCopy?: number,
  urlBtn?: TgReplyBtnUrl,
  autoDeleteIsoDateTime?: string,
  closePollIsoDateTime?: string,
  mediaGroupCaptionHtml?: string,
  mediaGroup?: PrimitiveMediaGroup[]
) {
  try {
    // send info message
    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.appConfig.logChannelId,
      makePublishInfoMessage(isoDate, time, blogName, tgChat, SN_TYPES.telegram),
      {
        reply_to_message_id: messageIdToCopy,
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
    messageIdToCopy: (mediaGroup) ? undefined : messageIdToCopy,
    urlBtn,
    // time like '2022-11-01T19:58:00+03:00'
    autoDeleteDateTime: autoDeleteIsoDateTime,
    // time like '2022-11-01T19:58:00+03:00'
    closePollDateTime: closePollIsoDateTime,
    mediaGroupCaptionHtml,
    mediaGroup,
  }

  await tgChat.app.tasks.addTaskAndLog(task);
}
