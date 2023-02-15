import {askSharePost} from './askSharePost.js';
import TgChat from '../../apiTg/TgChat.js';


export async function askChat(msg: string, tgChat: TgChat, onDone: (chatId: string | number) => void) {
  return askSharePost(msg, tgChat, tgChat.asyncCb(async (messageIds: number[], chatId: number) => {
    const res = await tgChat.app.tg.bot.telegram.getChat(chatId)
    const username = (res as any).username

    await tgChat.reply(
      tgChat.app.i18n.message.selectedChat
      + `: ${username} (${chatId})`
    )

    onDone(chatId)
  }))
}