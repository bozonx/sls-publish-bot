import TgChat from '../tgApi/TgChat';

//const aa = 'форматированный текст _ наклонный _ * жирный * __ подчёркнутый __ ~ перечёркнутый ~'

export async function publishTgPost(msg: string, channelId: number, tgChat: TgChat) {
  await tgChat.app.tg.bot.telegram.sendMessage(
    tgChat.app.config.channels[channelId].channelId,
    msg,
    {
      parse_mode: 'MarkdownV2',
    }
  );
}
