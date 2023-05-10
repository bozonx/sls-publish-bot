import {TgChat} from './TgChat.js';
import {Main} from '../Main.js';


const CHAT_DELIMITER = '|'


export class TelegramManager {
  readonly main: Main
  // {"botToken|chatId": TgChat}
  private readonly chats: Record<string, TgChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    this.main.tg.onCmdStart((botToken: string, chatId: number | string) => {
      const id = botToken + CHAT_DELIMITER + chatId

      if (!this.chats[id]) {
        this.chats[id] = new TgChat(this, botToken, chatId)
      }

      this.chats[id].init()
        .catch((e) => this.main.log.error(e));
    })
  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy()

      delete this.chats[itemIndex]
    }
  }

}
