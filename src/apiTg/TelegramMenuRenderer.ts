import {isPromise} from 'squidlet-lib';
import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from './TgChat.js';
import {MenuItem} from '../types/MenuItem.js';
import {MenuChangeHandler} from '../menuManager/MenuManager.js';
import {ChatEvents} from '../types/constants.js';


const CB_DELIMITER = '|'


export class TelegramMenuRenderer {
  currentPath: string = ''
  currentMenu: MenuItem[] = []

  private prevMenuMsgIds: number[] = []
  private readonly tgChat


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat
  }


  async init() {
    this.currentPath = ''

    this.tgChat.events.addListener(ChatEvents.CALLBACK_QUERY, this.handleClick)

    await this.toPath(this.currentPath)
  }

  async destroy() {
    this.currentPath = ''
    this.currentMenu = []
    this.prevMenuMsgIds = []
  }


  addMsgIdToDeleteOnMenuChange(msgId: number) {
    this.prevMenuMsgIds.push(msgId)
  }

  async toPath(menuPath: string) {
    this.currentPath = menuPath
    this.currentMenu = await this.collectCurrentItems(this.currentPath)

    const inlineKeys: TgReplyButton[][] = this.makeInlineKeys(this.currentPath, this.currentMenu)

    for (const msgId of this.prevMenuMsgIds) {
      await this.tgChat.deleteMessage(msgId)
        .catch((e) => this.tgChat.log.error)
    }

    // TODO: где взять сообщение ???
    const msg: string = 'aaa'
    // render a menu
    const msgId: number = await this.tgChat.reply(msg, inlineKeys, true, false)

    this.prevMenuMsgIds = [msgId]
  }

  handleClick = (cbId: string) => {
    const splat: string[] = cbId.split(CB_DELIMITER)

    if (splat[0] !== this.currentPath) return

    const itemId: string = splat[1]

    this.currentMenu[Number(itemId)].pressed()
  }


  private makeInlineKeys(currentPath: string, menuItems: MenuItem[]): TgReplyButton[][] {
    const result: TgReplyButton[][] = []

    for (const index in menuItems) {
      const item = menuItems[index]
      const cbId = currentPath + CB_DELIMITER + index

      result.push([
        {
          text: item.view.name,
          callback_data: cbId,
        }
      ])
    }

    return result
  }

  private async collectCurrentItems(currentPath: string): Promise<MenuItem[]> {
    const items: MenuItem[] = []
    const handlers: MenuChangeHandler[] = this.tgChat.app.menu.handlers

    for (const handler of handlers) {
      const res: undefined | MenuItem | Promise<MenuItem> = handler(currentPath)

      if (typeof res === 'undefined') continue

      if (isPromise(res)) {
        items.push(await res)
      }
      else {
        items.push(res as MenuItem)
      }
    }

    return items
  }

}
