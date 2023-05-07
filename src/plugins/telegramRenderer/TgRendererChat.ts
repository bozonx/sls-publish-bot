import {Window} from '../../AbstractUi/Window.js';
import {TelegramRenderer} from './TelegramRenderer.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../../types/MessageEvent.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {AnyElement} from '../../AbstractUi/interfaces/AnyElement.js';
import {UI_EVENTS} from '../../AbstractUi/interfaces/UiEvents.js';


export class TgRendererChat {
  public window: Window
  private renderer: TelegramRenderer
  // chat id where was start function called
  public readonly botChatId: number | string


  constructor(chatId: number | string, renderer: TelegramRenderer) {
    this.botChatId = chatId
    this.renderer = renderer
    this.window = this.renderer.ctx.newWindow()
  }


  async init() {
    this.window.onDomChanged(this.handleDomChanged)

    await this.window.init()
  }
  
  async destroy() {
    // TODO: должен вызываться из Renderer
  }
  
  

  handleCallbackQueryEvent(queryData: any) {
    if (!queryData) {
      this.renderer.ctx.consoleLog.warn('Empty data came to handleCallbackQueryEvent')

      return
    }

    this.window.handleUiEvent(UI_EVENTS.click, queryData)
  }

  handleIncomeTextEvent(msgEvent: TextMessageEvent) {
    this.window.handleUiEvent(UI_EVENTS.input, msgEvent)
  }

  handleIncomePhotoEvent(msgEvent: PhotoMessageEvent) {
    // try {
    //   this.events.emit(ChatEvents.PHOTO, msgEvent);
    // }
    // catch (e) {
    //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    // }
  }

  handleIncomeVideoEvent(msgEvent: VideoMessageEvent) {
    // try {
    //   this.events.emit(ChatEvents.VIDEO, msgEvent);
    // }
    // catch (e) {
    //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    // }
  }

  // handleIncomeMediaGroupItemEvent(msgEvent: MediaGroupItemMessageEvent) {
  //   this.events.emit(ChatEvents.MEDIA_GROUP_ITEM, msgEvent);
  // }

  handleIncomePollEvent(msgEvent: PollMessageEvent) {
    // try {
    //   this.events.emit(ChatEvents.POLL, msgEvent);
    // }
    // catch (e) {
    //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    // }
  }



  /////////////


  private handleDomChanged = () => {
    this.render()
  }

  private render() {
    (async () => {
      // TODO: remove previous menu
      // TODO: draw a new one
      // TODO: support of line groups
      // TODO: support of menu message in html

      await this.renderer.bot.telegram.sendMessage(
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
    })()
      .catch((e) => this.renderer.ctx.consoleLog.error(e))
  }

}


// export function convertMenuBtnsToTgInlineBtns(menu: DynamicMenuButton[]): TgReplyButton[][] {
//   return menu.map((item) => {
//     return [
//       {
//         text: item.label,
//         // TODO: наперное полный путь + name
//         callback_data: '!!!!',
//       }
//     ]
//   })
// }
