import TgChat from '../apiTg/TgChat';
import {
  publishTgCopy,
  publishTgImage,
  publishTgMediaGroup,
  publishTgPoll,
  publishTgText,
  publishTgVideo
} from '../apiTg/publishTg';
import {makePublishInfoMessage, resolveImageUrl} from './publishHelpers';
import {PostponeTgPostTask, TASK_TYPES} from '../types/TaskItem';
import {SN_TYPES} from '../types/snTypes';
import PollData from '../types/PollData';
import {TgReplyBtnUrl} from '../types/TgReplyButton';
import {PhotoData, PhotoUrlData, VideoData} from '../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {PrimitiveMediaGroup} from '../types/types';
import {makeIsoDateTimeStr} from './helpers';
import {makePost2000Text} from './makePost2000';


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
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string
) {
  if (postAsText) {
    // post as only text
    const imgUrl: string | undefined = resolveImageUrl(mediaGroup)
    const post2000Txt = await makePost2000Text(tgChat, resultTextHtml, imgUrl)

    await registerTgTaskOnlyText(
      blogName,
      tgChat,
      isoDate,
      time,
      post2000Txt,
      (imgUrl) ? true : usePreview,
      tgUrlBtn,
      autoDeleteTgIsoDateTime
    )
  }
  else if (mediaGroup.length > 1) {
    // post several images
    await registerTgTaskMediaGroup(
      blogName,
      tgChat,
      isoDate,
      time,
      mediaGroup,
      resultTextHtml,
      autoDeleteTgIsoDateTime
    );
  }
  else if (!mediaGroup.length) {
    throw new Error(`No media to post`)
  }
  else {
    // post as video
    if (mediaGroup[0].type === 'video') {
      if (!mediaGroup[0].fileId) throw new Error(`No video fileId`)

      await registerTgTaskVideo(
        blogName,
        tgChat,
        isoDate,
        time,
        mediaGroup[0].fileId,
        resultTextHtml,
        tgUrlBtn,
        autoDeleteTgIsoDateTime
      );
    }
    else {
      const imgUrl: string | undefined = resolveImageUrl(mediaGroup)

      if (!imgUrl) throw new Error(`No image`)

      await registerTgTaskImage(
        blogName,
        tgChat,
        isoDate,
        time,
        imgUrl,
        resultTextHtml,
        tgUrlBtn,
        autoDeleteTgIsoDateTime
      )
    }
  }

  await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
}

/**
 * Post only text to telegram, without image
 */
export async function registerTgTaskOnlyText(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  postHtml: string,
  allowPreview: boolean,
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgText(
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      postHtml,
      allowPreview,
      tgUrlBtn
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(tgChat, blogName, isoDate, time, msgId, tgUrlBtn, autoDeleteTgIsoDateTime);
}

/**
 * Post image to telegram
 */
export async function registerTgTaskImage(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  imageUrl: string,
  captionMd?: string,
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgImage(
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      imageUrl,
      captionMd,
      tgUrlBtn
    )
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(tgChat, blogName, isoDate, time, msgId, tgUrlBtn, autoDeleteTgIsoDateTime);
}

/**
 * Copy message to telegram chat. Useful for poll.
 */
export async function registerTgTaskCopy(
  blogName: string,
  tgChat: TgChat,
  // TODO: может сразу готовую дату принимать?
  isoDate: string,
  resolvedTime: string,
  messageId: number,
  autoDeleteTgIsoDateTime?: string,
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
    autoDeleteTgIsoDateTime,
    closePollIsoDateTime
  );
}

export async function registerTgTaskPoll(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  pollData: PollData,
  autoDeleteTgIsoDateTime?: string,
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
    autoDeleteTgIsoDateTime,
    closePollIsoDateTime
  );
}


/**
 * Post image to telegram
 */
async function registerTgTaskVideo(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  videoId: string,
  captionMd?: string,
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgVideo(
      tgChat.app,
      tgChat.app.appConfig.logChannelId,
      videoId,
      captionMd,
      tgUrlBtn
    );
  }
  catch (e) {
    await tgChat.reply(tgChat.app.i18n.errors.cantPostToLogChannel + e);

    throw new Error(`Can't publish prepared post to telegram to log channel`);
  }

  await registerPublishTaskTg(tgChat, blogName, isoDate, time, msgId, tgUrlBtn, autoDeleteTgIsoDateTime);
}

/**
 * Post media group to telegram
 */
async function registerTgTaskMediaGroup(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  mediaGroup: (PhotoData | PhotoUrlData | VideoData)[],
  captionMd?: string,
  autoDeleteTgIsoDateTime?: string
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
    autoDeleteTgIsoDateTime,
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
  autoDeleteTgIsoDateTime?: string,
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
  // TODO: проверить
  // moment(`${isoDate} ${time}`).utcOffset(tgChat.app.appConfig.utcOffset).format()
  // const startTime = moment(`${isoDate}T${time}:00`)
  //   .utcOffset(tgChat.app.appConfig.utcOffset).format();
  const startTime = makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)

  if (!chatId) {
    await tgChat.reply(tgChat.app.i18n.errors.noChannel)

    throw new Error(`Telegram chat id doesn't set`)
  }

  // TODO: review

  const task: PostponeTgPostTask = {
    // time like '2022-11-01T19:58:00+03:00'
    startTime,
    type: TASK_TYPES.postponePost,
    chatId,
    sn: SN_TYPES.telegram as 'telegram',
    messageIdToCopy: (mediaGroup) ? undefined : messageIdToCopy,
    urlBtn,
    // time like '2022-11-01T19:58:00+03:00'
    autoDeleteDateTime: autoDeleteTgIsoDateTime,
    // time like '2022-11-01T19:58:00+03:00'
    closePollDateTime: closePollIsoDateTime,
    mediaGroupCaptionHtml,
    mediaGroup,
  }

  await tgChat.app.tasks.addTaskAndLog(task)
}
