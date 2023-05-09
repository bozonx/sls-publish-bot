import {TgRendererChat} from './TgRendererChat.js';
import {Main} from '../Main.js';


export class TelegramRenderer {
  readonly main: Main
  // {"chatId": TgRendererChat}
  private readonly chats: Record<string, TgRendererChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {

    this.main.tg.onCmdStart((botToken: string, chatId: number) => {
      if (!this.chats[chatId]) {
        this.chats[chatId] = new TgRendererChat(this, this.main.config.testBotToken, chatId)
      }

      this.chats[ctx.chat.id].init()
        .catch((e) => this.ctx.consoleLog.error(e));
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
