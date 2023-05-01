import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from './TgChat.js';
import {MenuItem, MenuItemContext} from '../types/MenuItem.js';
import {MenuDefinition, MenuEvents} from '../menuManager/MenuManager.js';
import {ChatEvents} from '../types/constants.js';


const CB_DELIMITER = '|'
const ITEM_INDEX_DELIMITER = '.'


export interface StatefulMenuDefinition extends MenuDefinition {
  state: Record<string, any>
}


export class TelegramMenuRenderer {
  currentDefinition?: MenuDefinition
  currentMenu: MenuItem[][] = []
  private steps: MenuDefinition[] = []

  private prevMenuMsgIds: number[] = []
  private readonly tgChat
  private itemContext: MenuItemContext


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat
    this.itemContext = {
      toPath: async (
        toDefinition?: Omit<MenuDefinition, 'state'>,
        replaceState?: Record<string, any>
      )=> this.toPath(toDefinition, replaceState),
    }
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

  async toPath(
    toDefinition?: Omit<MenuDefinition, 'state'>,
    replaceState?: Record<string, any>
  ) {
    if (!toDefinition) return

    // TODO: use replaceState

    this.currentDefinition = {
      ...toDefinition,
      state: replaceState,
    }
    this.currentMenu = await this.tgChat.app.menu.collectCurrentItems(this.currentDefinition)

    const inlineKeys: TgReplyButton[][] = this.makeInlineKeys(this.currentDefinition, this.currentMenu)
    // delete prev messages
    for (const msgId of this.prevMenuMsgIds) {
      await this.tgChat.deleteMessage(msgId)
        .catch((e) => this.tgChat.log.error)
    }
    // TODO: а если нет сообщения ???? просто кнопки отобразятся???
    // render the menu
    const msgId: number = await this.tgChat.reply(
      this.currentDefinition.messageHtml || '',
      inlineKeys,
      true,
      true
    )

    if (this.steps.length === 1 && this.steps[0].name !== '') {
      items.push([this.makeBackToMainMenuBtn()])
    }
    else if (this.steps.length > 1) {
      items.push([this.makeBackBtn()])
      items.push([this.makeCancelBtn()])
    }

    this.prevMenuMsgIds = [msgId]
  }

  handleClick = (cbId: string) => {
    const splat: string[] = cbId.split(CB_DELIMITER)
    // TODO: взять полный путь
    if (splat[0] !== this.currentDefinition?.name) return

    const [rowIndex, itemIndex] = splat[1].split(ITEM_INDEX_DELIMITER)

    this.currentMenu[Number(rowIndex)][Number(itemIndex)]
      .pressed({...this.itemContext})
      .catch((e) => this.tgChat.log.error(e))
  }


  private makeInlineKeys(
    currentDefinition: MenuDefinition,
    menuItems: MenuItem[][]
  ): TgReplyButton[][] {
    const result: TgReplyButton[][] = []

    for (const rowIndex in menuItems) {
      for (const itemIndex in menuItems[rowIndex]) {
        const item = menuItems[rowIndex][itemIndex]
        // TODO: взять полный путь
        const cbId = currentDefinition.name + CB_DELIMITER
          + rowIndex + ITEM_INDEX_DELIMITER + itemIndex

        result.push([
          {
            text: item.view.name,
            callback_data: cbId,
          }
        ])
      }
    }

    return result
  }

  private makeBackToMainMenuBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.toMainMenu},
      pressed: async (itemCtx: MenuItemContext) => {
        this.actionEvents.emit(MenuEvents.toMainMenu)
      }
    }
  }

  private makeBackBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.back},
      pressed: async (itemCtx: MenuItemContext) => {
        this.actionEvents.emit(MenuEvents.back)
      }
    }
  }

  private makeCancelBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.cancel},
      pressed: async (itemCtx: MenuItemContext) => {
        this.actionEvents.emit(MenuEvents.cancel)
      }
    }
  }

}
