import {isPromise} from 'squidlet-lib';
import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from './TgChat.js';
import {MenuItem} from '../types/MenuItem.js';
import {MenuChangeHandler} from '../menuManager/MenuManager.js';


const CB_DELIMITER = '|'


export class TelegramMenuRenderer {
  currentPath: string = ''
  currentMenu: MenuItem[] = []

  private readonly tgChat


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat
  }


  async init() {
    this.currentPath = ''

    await this.toPath(this.currentPath)
  }

  async destroy() {
    this.currentPath = ''
    this.currentMenu = []
  }


  async toPath(menuPath: string) {
    this.currentPath = menuPath
    this.currentMenu = await this.collectCurrentItems(this.currentPath)

    const inlineKeys: TgReplyButton[][] = this.makeInlineKeys(this.currentPath, this.currentMenu)


    // TODO: надо нарисовать сразу

    // TODO: слушать события клика

  }

  handleClick(cbId: string) {
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
      const res: MenuItem | Promise<MenuItem> = handler(currentPath)

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
