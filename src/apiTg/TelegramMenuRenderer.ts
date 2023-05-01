import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from './TgChat.js';


const CB_DELIMITER = '|'


export class TelegramMenuRenderer {
  private readonly tgChat


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat
  }


  async makeInlineKeys(): Promise<TgReplyButton[][]> {
    const result: TgReplyButton[][] = []

    for (const index in this.tgChat.menu.currentMenu) {
      const item = this.tgChat.menu.currentMenu[index]
      const cbId = this.tgChat.menu.currentPath + CB_DELIMITER + index

      result.push([
        {
          text: item.view.name,
          callback_data: cbId,
        }
      ])
    }

    // TODO: слушать события

    return result
  }

  handleClick(cbId: string) {
    const splat: string[] = cbId.split(CB_DELIMITER)

    if (splat[0] !== this.tgChat.menu.currentPath) return

    const itemId: string = splat[1]

    this.tgChat.menu.currentMenu[Number(itemId)].pressed()
  }

}
