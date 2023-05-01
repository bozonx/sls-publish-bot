import App from '../App.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from '../apiTg/TgChat.js';


export class TelegramMenuRenderer {
  private readonly tgChat


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat
  }

  async init() {
  }


  async makeInlineKeys(): Promise<TgReplyButton[][]> {
    const result: TgReplyButton[][] = []

    for (const index in this.app.menu.currentMenu) {
      const item = this.app.menu.currentMenu[index]
      const itemView = item.render()
      const cbId = this.app.menu.currentPath + ':' + index

      result.push([
        {
          text: itemView.name,
          callback_data: cbId,
        }
      ])
    }

    // TODO: слушать события

    return result
  }

  handleClick(cbId: string) {
    const splat: string[] = cbId.split(':')

    if (splat[0] !== this.app.menu.currentPath) return

    const itemId: string = splat[1]

    this.app.menu.currentMenu[Number(itemId)].pressed()
  }

}
