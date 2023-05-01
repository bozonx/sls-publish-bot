import {TgReplyButton} from '../types/TgReplyButton.js';
import TgChat from './TgChat.js';
import {MenuItem, MenuItemContext} from '../types/MenuItem.js';
import {ChatEvents} from '../types/constants.js';
import {MenuStep, SpecificMenuBase} from '../menuManager/SpecificMenuBase.js';


const CB_DELIMITER = '|'
const ITEM_INDEX_DELIMITER = '.'
export const MENU_DELIMITER = '/'


export class TelegramMenuRenderer extends SpecificMenuBase {
  currentStep?: MenuStep
  currentMenu: MenuItem[][] = []

  private prevMenuMsgIds: number[] = []
  private readonly tgChat
  private itemContext: MenuItemContext


  constructor(tgChat: TgChat) {
    super()

    this.tgChat = tgChat
    this.itemContext = {
      toPath: async (
        name: string,
        messageHtml?: string,
        state?: Record<string, any>,
      )=> this.toPath(name, messageHtml, state),
      backToPath: async (pathTo: string) => this.backToPath(pathTo),
      backSteps: async(stepsNum: number) => this.backSteps(stepsNum),
    }
  }


  async init(currentDefinition: MenuStep) {
    this.tgChat.events.addListener(ChatEvents.CALLBACK_QUERY, this.handleClick)

    await this.toPath(
      currentDefinition.name,
      currentDefinition.messageHtml,
      currentDefinition.state
    )
  }

  async destroy() {
    this.currentStep = undefined
    this.currentMenu = []
    this.prevMenuMsgIds = []
  }


  addMsgIdToDeleteOnMenuChange(msgId: number) {
    this.prevMenuMsgIds.push(msgId)
  }

  async toPath(name: string, messageHtml?: string, state?: Record<string, any>) {
    this.currentStep = {
      name,
      messageHtml,
      state: state || {},
    }
    this.currentMenu = [
      ...await this.tgChat.app.menu.collectCurrentItems(this.currentStep),
      ...this.makeSystemBtns(),
    ]

    const inlineKeys: TgReplyButton[][] = this.makeInlineKeys(this.currentStep, this.currentMenu)
    // delete prev messages
    for (const msgId of this.prevMenuMsgIds) {
      await this.tgChat.deleteMessage(msgId)
        .catch((e) => this.tgChat.log.error)
    }
    // TODO: а если нет сообщения ???? просто кнопки отобразятся???
    // render the menu
    const msgId: number = await this.tgChat.reply(
      this.currentStep.messageHtml || '',
      inlineKeys,
      true,
      true
    )

    this.prevMenuMsgIds = [msgId]
  }

  async backToPath(pathTo: string) {
    // TODO: add
  }

  async backSteps(stepsNum: number) {
    // TODO: add
  }

  handleClick = (cbId: string) => {
    const splat: string[] = cbId.split(CB_DELIMITER)
    // TODO: взять полный путь
    if (splat[0] !== this.currentStep?.name) return

    const [rowIndex, itemIndex] = splat[1].split(ITEM_INDEX_DELIMITER)

    this.currentMenu[Number(rowIndex)][Number(itemIndex)]
      .pressed({...this.itemContext})
      .catch((e) => this.tgChat.log.error(e))
  }


  private makeInlineKeys(
    currentDefinition: MenuStep,
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

}
