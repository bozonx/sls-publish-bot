import {TgRendererChat} from './TgRendererChat.js';
import {Main} from '../Main.js';


export class TelegramRenderer {
  readonly main: Main
  // {"chatId": TgRendererChat}
  private readonly chats: Record<string, TgRendererChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  init() {

  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy();
      // @ts-ignore
      this.chats[itemIndex] = undefined;
    }
  }


}
