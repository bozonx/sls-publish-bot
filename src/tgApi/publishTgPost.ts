import TgChat from './TgChat';


export async function publishTgPost(msg: string, channelId: number, tgChat: TgChat) {
  await tgChat.app.tg.bot.telegram.sendMessage(
    tgChat.app.config.channels[channelId].channelId,
    msg,
    {
      parse_mode: tgChat.app.config.telegram.parseMode,
    }
  );
}
