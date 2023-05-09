import {Window} from '../../../src/AbstractUi/Window.js';
import {TelegramRenderer} from './TelegramRenderer.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../../../src/types/MessageEvent.js';
import {UI_EVENTS} from '../../../src/AbstractUi/interfaces/UiEvents.js';
import {convertDocumentToTgUi} from './convertDocumentToTgUi.js';


export class TgRendererChat {
  // chat id where was start function called
  readonly botChatId: number | string

  private botToken: string
  private window!: Window
  private renderer: TelegramRenderer
  private menuMsgId?: number


  constructor(botToken: string, botChatId: number | string, renderer: TelegramRenderer) {
    this.botToken = botToken
    this.botChatId = botChatId
    this.renderer = renderer

  }


  async init() {
    const windowConfig = this.renderer.main.uiFilesManager
      .loadWindowConfig(this.botToken)
    this.window = new Window(windowConfig)
    this.window.onDomChanged(() => this.render())

    await this.window.init()
  }
  
  async destroy() {
    // TODO: должен вызываться из Renderer
  }


  handleCallbackQueryEvent(queryData: any) {
    if (!queryData) {
      this.renderer.main.log.warn('Empty data came to handleCallbackQueryEvent')

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
      .catch((e) => this.renderer.main.log.error(e))
  }

}
