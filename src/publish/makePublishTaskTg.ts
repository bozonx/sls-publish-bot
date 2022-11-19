import TgChat from '../apiTg/TgChat';
import {publishTgCopy, publishTgImage, publishTgText} from '../apiTg/publishTg';
import {makePublishInfoMessage, registerTaskTg} from './publishHelpers';


/**
 * Post only text, without image
 */
export async function makePublishTaskTgOnlyText(
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
    msgId = await publishTgText(
      tgChat.app.appConfig.logChannelId,
      postStr,
      tgChat,
      !allowPreview
    );

    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.appConfig.logChannelId,
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

    // TODO: сделать поддержку нескольких картинок

    msgId = await publishTgImage(
      tgChat.app.appConfig.logChannelId,
      imageUrl,
      tgChat,
      captionMd
    )

    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.appConfig.logChannelId,
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

    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.appConfig.logChannelId,
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
