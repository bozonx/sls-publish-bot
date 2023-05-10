import {Window} from '../../../src/AbstractUi/Window.js';
import {TelegramManager} from './TelegramManager.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../../../src/types/MessageEvent.js';
import {convertDocumentToTgUi} from './convertDocumentToTgUi.js';
import {Main} from '../Main.js';
import {TG_PARSE_MODE} from '../types/constants.js';


export class TgChat {
  // chat id where was start function called
  private readonly botChatId: number | string
  private readonly botToken: string
  private window!: Window
  private telegramManager: TelegramManager
  private menuMsgId?: number


  // TODO: токен брать как-то по другому, ведь юзер сам может задать своего бота


  get main(): Main {
    return this.telegramManager.main
  }


  constructor(telegramManager: TelegramManager, botToken: string, botChatId: number | string) {
    this.telegramManager = telegramManager
    this.botToken = botToken
    this.botChatId = botChatId
  }


  async init() {
    const windowConfig = await this.main.uiFilesManager
      .loadWindowConfig(this.botToken)
    this.window = new Window(windowConfig)
    // TODO: review
    this.window.onDomChanged(() => this.renderMenu())

    await this.window.init()

    this.startListeners()
  }
  
  async destroy() {
    // TODO: должен вызываться из Renderer
  }


  startListeners() {
    this.main.tg.onCallbackQuery(this.botToken, this.botChatId, (queryData: string) => {
      if (!queryData) {
        this.main.log.warn('Empty data came ad callback query')

        return
      }

      //this.window.handleUiEvent(UI_EVENTS.click, queryData)
    })

    //
    // handleIncomeTextEvent(msgEvent: TextMessageEvent) {
    //   // TODO: нужно отправить это в элемент в фокусе
    //   //this.window.handleUiEvent(UI_EVENTS.input, msgEvent)
    // }
    //
    // handleIncomePhotoEvent(msgEvent: PhotoMessageEvent) {
    //   // try {
    //   //   this.events.emit(ChatEvents.PHOTO, msgEvent);
    //   // }
    //   // catch (e) {
    //   //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    //   // }
    // }
    //
    // handleIncomeVideoEvent(msgEvent: VideoMessageEvent) {
    //   // try {
    //   //   this.events.emit(ChatEvents.VIDEO, msgEvent);
    //   // }
    //   // catch (e) {
    //   //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    //   // }
    // }
    //
    // // handleIncomeMediaGroupItemEvent(msgEvent: MediaGroupItemMessageEvent) {
    // //   this.events.emit(ChatEvents.MEDIA_GROUP_ITEM, msgEvent);
    // // }
    //
    // handleIncomePollEvent(msgEvent: PollMessageEvent) {
    //   // try {
    //   //   this.events.emit(ChatEvents.POLL, msgEvent);
    //   // }
    //   // catch (e) {
    //   //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    //   // }
    // }
  }


  private renderMenu() {
    (async () => {
      const [messageHtml, buttons] = convertDocumentToTgUi(this.window.rootDocument)

      if (typeof this.menuMsgId !== 'undefined') {
        await this.main.tg.deleteMessage(this.botToken, this.botChatId, this.menuMsgId)
      }

      const sentMessage = await this.main.tg.sendTextMessage(
        this.botToken,
        this.botChatId,
        messageHtml,
        {
          parse_mode: TG_PARSE_MODE,
          reply_markup: {
            inline_keyboard: buttons
          },
          disable_web_page_preview: true,
        },
      )

      this.menuMsgId = sentMessage.message_id
    })()
      .catch((e) => this.main.log.error(e))
  }

}
