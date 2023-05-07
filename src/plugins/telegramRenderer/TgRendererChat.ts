import {DynamicMenuInstance} from '../../DynamicMenu/DynamicMenuInstance.js';
import {DynamicMenuButton} from '../../DynamicMenu/interfaces/DynamicMenuButton.js';
import {convertMenuBtnsToTgInlineBtns, TelegramRenderer} from './TelegramRenderer.js';


export class TgRendererChat {
  private renderer: TelegramRenderer
  // chat id where was start function called
  public readonly botChatId: number | string
  private menuInstanceContext: Record<string, any> = {}
  private menuInstance!: DynamicMenuInstance


  constructor(chatId: number | string, renderer: TelegramRenderer) {
    this.botChatId = chatId
    this.renderer = renderer
  }


  async init() {
    this.menuInstance = this.renderer.system.menu.makeInstance(this.menuInstanceContext)

    this.menuInstance.renderEvent.addListener(this.renderHandler)

    this.menuInstance.init()
  }

  async renderMenu(message: string, menu: DynamicMenuButton[]) {
    const buttons = convertMenuBtnsToTgInlineBtns(menu)

    this.renderer.bot.telegram.sendMessage(
      this.botChatId,
      message,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: buttons
        },
        disable_web_page_preview: true,
      },
    )
  }


  private renderHandler = (menu: DynamicMenuButton[]) => {
    console.log(1111, menu, this.menuInstance.breadCrumbs.getCurrentPath())

    this.renderMenu('somemst', menu)
      .catch((e) => {
        // TODO: what to do on error???
      })

    // TODO: remove previous menu
    // TODO: draw a new one
    // TODO: support of line groups
    // TODO: support of menu message in html
  }

}
