import TgChat from './TgChat';


export async function publishTgPost(
  chatId: number | string,
  msg: string,
  blogName: string,
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
