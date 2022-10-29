import TgChat from '../tgApi/TgChat';


export async function publishTgPost(msg: string, channelId: number, tgChat: TgChat) {
  await tgChat.app.tg.bot.telegram.sendMessage(
    tgChat.app.config.channels[channelId].channelId,
    msg,
    {
      parse_mode: 'MarkdownV2',
    }
  );
}
