import TgChat from './TgChat.js';
import PollData from '../types/PollData.js';
import {PhotoData, PhotoUrlData, VideoData} from '../types/MessageEvent.js';


/**
 * Publish only text without image
 */
export async function publishTgText(
  chatId: number | string,
  msg: string,
  tgChat: TgChat,
  allowPreview = true,
  btnUrl?: {text: string, url: string},
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendMessage(
    chatId,
    msg,
    {
      parse_mode: tgChat.app.appConfig.telegram.parseMode,
      disable_web_page_preview: !allowPreview,
      disable_notification: disableNotification,
      reply_markup: btnUrl && {
        inline_keyboard: [
          [ btnUrl ]
        ]
      } || undefined,
    }
  );

  return result.message_id;
}

/**
 * Publish one image
 */
export async function publishTgImage(
  chatId: number | string,
  imageUrl: string,
  tgChat: TgChat,
  captionMd?: string,
  btnUrl?: {text: string, url: string},
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendPhoto(
    chatId,
    imageUrl,
    {
      caption: captionMd,
      parse_mode: tgChat.app.appConfig.telegram.parseMode,
      disable_notification: disableNotification,
      reply_markup: btnUrl && {
        inline_keyboard: [
          [ btnUrl ]
        ]
      } || undefined,
    }
  );

  return result.message_id;
}

/**
 * Publish one video
 */
export async function publishTgVideo(
  chatId: number | string,
  videoUrl: string,
  tgChat: TgChat,
  captionMd?: string,
  btnUrl?: {text: string, url: string},
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendVideo(
    chatId,
    videoUrl,
    {
      caption: captionMd,
      parse_mode: tgChat.app.appConfig.telegram.parseMode,
      disable_notification: disableNotification,
      reply_markup: btnUrl && {
        inline_keyboard: [
          [ btnUrl ]
        ]
      } || undefined,
    }
  );

  return result.message_id;
}

/**
 * Publish media group
 */
export async function publishTgMediaGroup(
  chatId: number | string,
  mediaGroup: (PhotoData | PhotoUrlData | VideoData)[],
  tgChat: TgChat,
  captionMd?: string,
  btnUrl?: {text: string, url: string},
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendMediaGroup(
    chatId,
    mediaGroup.map((el, index) => {
      const firstItemDate = (index) ? {} : {
        caption: captionMd,
        parse_mode: tgChat.app.appConfig.telegram.parseMode,
      };

      if (el.type === 'photo') {
        return {
          type: 'photo',
          media: el.fileId,
          ...firstItemDate,
        };
      }
      else if (el.type === 'photoUrl') {
        return {
          type: 'photo',
          media: el.url,
          ...firstItemDate,
        };
      }
      else if (el.type === 'video') {
        return {
          type: 'video',
          media: el.fileId,
          ...firstItemDate,
        };
      }
      else {
        throw new Error(`Unknown media`);
      }
    }),
    {
      disable_notification: disableNotification,
      // reply_markup: btnUrl && {
      //   inline_keyboard: [
      //     [ btnUrl ]
      //   ]
      // } || undefined,
    }
  );

  console.log(33333, result);

  return 0;

  //return result.message_id;
}

/**
 * Make copy of message
 */
export async function publishTgCopy(
  chatId: number | string,
  fromChatId: number | string,
  messageId: number,
  tgChat: TgChat,
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.copyMessage(
    chatId,
    fromChatId,
    messageId,
    {
      disable_notification: disableNotification,
    }
  );

  return result.message_id;
}

/**
 * Publish poll
 */
export async function publishTgPoll(
  chatId: number | string,
  pollData: PollData,
  tgChat: TgChat,
  disableNotification = false
): Promise<number> {
  if (pollData.type === 'quiz') {
    return (await tgChat.app.tg.bot.telegram.sendQuiz(
      chatId,
      pollData.question,
      pollData.options,
      {
        is_anonymous: pollData.isAnonymous,
        correct_option_id: pollData.correctOptionId,
        explanation: pollData.explanation,
        explanation_parse_mode: tgChat.app.appConfig.telegram.parseMode,
        disable_notification: disableNotification,
      }
    )).message_id;
  }
  else {
    return (await tgChat.app.tg.bot.telegram.sendPoll(
      tgChat.app.appConfig.logChannelId,
      pollData.question,
      pollData.options,
      {
        is_anonymous: pollData.isAnonymous,
        allows_multiple_answers: pollData.multipleAnswers,
        disable_notification: disableNotification,
      }
    )).message_id;
  }
}
