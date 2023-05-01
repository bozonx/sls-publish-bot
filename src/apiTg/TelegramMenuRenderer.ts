import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from './TgChat.js';
import {MenuItem} from '../types/MenuItem.js';
import {MenuDefinition} from '../menuManager/MenuManager.js';
import {ChatEvents} from '../types/constants.js';


const CB_DELIMITER = '|'


export class TelegramMenuRenderer {
  currentDefinition?: MenuDefinition
  currentMenu: MenuItem[] = []

  private prevMenuMsgIds: number[] = []
  private readonly tgChat


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat
  }


  async init(currentDefinition: MenuDefinition) {
    this.tgChat.events.addListener(ChatEvents.CALLBACK_QUERY, this.handleClick)

    await this.toPath(currentDefinition)
  }

  async destroy() {
    this.currentDefinition = undefined
    this.currentMenu = []
    this.prevMenuMsgIds = []
  }


  addMsgIdToDeleteOnMenuChange(msgId: number) {
    this.prevMenuMsgIds.push(msgId)
  }

  async toPath(toDefinition?: MenuDefinition) {
    if (!toDefinition) return

    this.currentDefinition = toDefinition
    this.currentMenu = await this.tgChat.app.menu.collectCurrentItems(this.currentDefinition)

    const inlineKeys: TgReplyButton[][] = this.makeInlineKeys(this.currentDefinition, this.currentMenu)
    // delete prev messages
    for (const msgId of this.prevMenuMsgIds) {
      await this.tgChat.deleteMessage(msgId)
        .catch((e) => this.tgChat.log.error)
    }
    // render the menu
    const msgId: number = await this.tgChat.reply(
      this.currentDefinition.messageHtml,
      inlineKeys,
      true,
      true
    )

    this.prevMenuMsgIds = [msgId]
  }

  handleClick = (cbId: string) => {
    const splat: string[] = cbId.split(CB_DELIMITER)

    if (splat[0] !== this.currentDefinition?.path) return

    const itemId: string = splat[1]

    this.currentMenu[Number(itemId)].pressed()
  }


  private makeInlineKeys(
    currentDefinition: MenuDefinition,
    menuItems: MenuItem[]
  ): TgReplyButton[][] {
    const result: TgReplyButton[][] = []

    for (const index in menuItems) {
      const item = menuItems[index]
      const cbId = currentDefinition.path + CB_DELIMITER + index

      result.push([
        {
          text: item.view.name,
          callback_data: cbId,
        }
      ])
    }

    return result
  }

}
