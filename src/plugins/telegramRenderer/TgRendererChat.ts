import {Window} from '../../AbstractUi/Window.js';
import {TelegramRenderer} from './TelegramRenderer.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../../types/MessageEvent.js';
import {UI_EVENTS} from '../../AbstractUi/interfaces/UiEvents.js';
import {convertDocumentToTgUi} from './convertDocumentToTgUi.js';


export class TgRendererChat {
  window: Window
  // chat id where was start function called
  readonly botChatId: number | string

  private renderer: TelegramRenderer
  private menuMsgId?: number


  constructor(chatId: number | string, renderer: TelegramRenderer) {
    this.botChatId = chatId
    this.renderer = renderer
    this.window = this.renderer.ctx.newWindow()
  }


  async init() {
    this.window.onDomChanged(() => this.render())

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


  private render() {
    (async () => {
      const [messageHtml, buttons] = convertDocumentToTgUi(this.window.rootDocument)

      if (typeof this.menuMsgId !== 'undefined') {
        await this.renderer.bot.telegram.deleteMessage(this.botChatId, this.menuMsgId)
      }

      const sentMessage = await this.renderer.bot.telegram.sendMessage(
        this.botChatId,
        messageHtml,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: buttons
          },
          disable_web_page_preview: true,
        },
      )

      this.menuMsgId = sentMessage.message_id
    })()
      .catch((e) => this.renderer.ctx.consoleLog.error(e))
  }

}
