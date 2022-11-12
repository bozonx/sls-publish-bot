import TgChat from './TgChat';


export async function publishTgPostNoImage(
  chatId: number | string,
  msg: string,
  tgChat: TgChat,
  disablePreview = false,
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendMessage(
    chatId,
    msg,
    {
      parse_mode: tgChat.app.appConfig.telegram.parseMode,
      disable_web_page_preview: disablePreview,
      disable_notification: disableNotification,
      // TODO: add web buttons for ad
    }
  );

  return result.message_id;
}

export async function publishTgImage(
  chatId: number | string,
  imageUrl: string,
  tgChat: TgChat,
  captionMd?: string,
  disableNotification = false
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendPhoto(
    chatId,
    imageUrl,
    {
      caption: captionMd,
      parse_mode: tgChat.app.appConfig.telegram.parseMode,
      disable_notification: disableNotification,
      // TODO: add web buttons for ad
    }
  );

  return result.message_id;
}

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
