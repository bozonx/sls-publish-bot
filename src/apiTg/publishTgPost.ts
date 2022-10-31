import TgChat from './TgChat';


export async function publishTgPost(
  chatId: number | string,
  msg: string,
  channelId: number,
  tgChat: TgChat
): Promise<number> {
  const result = await tgChat.app.tg.bot.telegram.sendMessage(
    chatId,
    msg,
    {
      parse_mode: tgChat.app.appConfig.telegram.parseMode,
    }
  );

  return result.message_id;
}
