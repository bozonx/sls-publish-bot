import {TgChat} from './TgChat.js';
import {Main} from '../Main.js';


export class TelegramManager {
  readonly main: Main
  // {"chatId": TgChat}
  private readonly chats: Record<string, TgChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    this.main.tg.onCmdStart((botToken: string, chatId: number) => {
      if (!this.chats[chatId]) {
        this.chats[chatId] = new TgChat(this, this.main.config.testBotToken, chatId)
      }

      this.chats[chatId].init()
        .catch((e) => this.main.log.error(e));
    })
  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy();
      // @ts-ignore
      this.chats[itemIndex] = undefined;
    }
  }

}
