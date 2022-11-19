import TgChat from './TgChat';


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
