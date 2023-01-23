import App from '../App.js';
import PollData from '../types/PollData.js';
import {PhotoData, PhotoUrlData, VideoData} from '../types/MessageEvent.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';


/**
 * Publish only text without image
 */
export async function publishTgText(
  app: App,
  chatId: number | string,
  msg: string,
  allowPreview = true,
  urlBtn?: TgReplyBtnUrl,
  disableNotification = false
): Promise<number> {
  const result = await app.tg.bot.telegram.sendMessage(
    chatId,
    msg,
    {
      parse_mode: app.appConfig.telegram.parseMode,
      disable_web_page_preview: !allowPreview,
      disable_notification: disableNotification,
      reply_markup: urlBtn && {
        inline_keyboard: [
          [ urlBtn ]
        ]
      },
    }
  );

  return result.message_id;
}

/**
 * Publish one image
 */
export async function publishTgImage(
  app: App,
  chatId: number | string,
  imageUrl: string,
  captionMd?: string,
  urlBtn?: TgReplyBtnUrl,
  disableNotification = false
): Promise<number> {
  const result = await app.tg.bot.telegram.sendPhoto(
    chatId,
    imageUrl,
    {
      caption: captionMd,
      parse_mode: app.appConfig.telegram.parseMode,
      disable_notification: disableNotification,
      reply_markup: urlBtn && {
        inline_keyboard: [
          [ urlBtn ]
        ]
      },
    }
  );

  return result.message_id;
}

/**
 * Publish one video
 */
export async function publishTgVideo(
  app: App,
  chatId: number | string,
  videoUrl: string,
  captionMd?: string,
  urlBtn?: TgReplyBtnUrl,
  disableNotification = false
): Promise<number> {
  const result = await app.tg.bot.telegram.sendVideo(
    chatId,
    videoUrl,
    {
      caption: captionMd,
      parse_mode: app.appConfig.telegram.parseMode,
      disable_notification: disableNotification,
      reply_markup: urlBtn && {
        inline_keyboard: [
          [ urlBtn ]
        ]
      },
    }
  );

  return result.message_id;
}

/**
 * Publish media group
 */
export async function publishTgMediaGroup(
  app: App,
  chatId: number | string,
  mediaGroup: (PhotoData | PhotoUrlData | VideoData)[],
  captionMd?: string,
  urlBtn?: TgReplyBtnUrl,
  disableNotification = false
): Promise<number[]> {
  const result = await app.tg.bot.telegram.sendMediaGroup(
    chatId,
    mediaGroup.map((el, index) => {
      const firstItemData = (index) ? {} : {
        caption: captionMd,
        parse_mode: app.appConfig.telegram.parseMode,

        // TODO: проверить

        reply_markup: urlBtn && {
          inline_keyboard: [
            [ urlBtn ]
          ]
        },

      };

      if (el.type === 'photo') {
        return {
          type: 'photo',
          media: el.fileId,
          ...firstItemData,
        };
      }
      else if (el.type === 'photoUrl') {
        return {
          type: 'photo',
          media: el.url,
          ...firstItemData,
        };
      }
      else if (el.type === 'video') {
        return {
          type: 'video',
          media: el.fileId,
          ...firstItemData,
        };
      }
      else {
        throw new Error(`Unknown media`);
      }
    }),
    {
      disable_notification: disableNotification,
    }
  );

  return result.map((e) => e.message_id);
}

/**
 * Make copy of message
 */
export async function publishTgCopy(
  app: App,
  chatId: number | string,
  fromChatId: number | string,
  messageId: number,
  urlBtn?: TgReplyBtnUrl,
  disableNotification = false
): Promise<number> {
  const result = await app.tg.bot.telegram.copyMessage(
    chatId,
    fromChatId,
    messageId,
    {
      disable_notification: disableNotification,
      reply_markup: urlBtn && {
        inline_keyboard: [
          [urlBtn]
        ]
      }
    }
  );

  return result.message_id;
}

/**
 * Publish poll
 */
export async function publishTgPoll(
  app: App,
  chatId: number | string,
  pollData: PollData,
  disableNotification = false
): Promise<number> {
  if (pollData.type === 'quiz') {
    return (await app.tg.bot.telegram.sendQuiz(
      chatId,
      pollData.question,
      pollData.options,
      {
        is_anonymous: pollData.isAnonymous,
        correct_option_id: pollData.correctOptionId,
        explanation: pollData.explanation,
        explanation_parse_mode: app.appConfig.telegram.parseMode,
        disable_notification: disableNotification,
      }
    )).message_id;
  }
  else {
    return (await app.tg.bot.telegram.sendPoll(
      app.appConfig.logChannelId,
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
