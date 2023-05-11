import {Window} from '../../../src/AbstractUi/Window.js';
import {ChatsManager} from './ChatsManager.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../../../src/types/MessageEvent.js';
import {convertDocumentToTgUi} from '../ui/convertDocumentToTgUi.js';
import {Main} from '../Main.js';
import {TG_PARSE_MODE} from '../types/constants.js';


export class TgChat {
  readonly botId: string
  readonly chatId: string

  private window!: Window
  private chatsManager: ChatsManager
  private menuMsgId?: number


  get main(): Main {
    return this.chatsManager.main
  }


  constructor(chatsManager: ChatsManager, botId: string, chatId: string) {
    this.chatsManager = chatsManager
    this.botId = botId
    this.chatId = chatId
  }


  async init() {

    // TODO: а когда будет навешивание событий

    const windowConfig = await this.main.uiFilesManager
      .loadWindowConfig(this.botId)
    // this.window = new Window(windowConfig)
    // // TODO: review
    // this.window.onDomChanged(() => this.renderMenu())
    //
    // await this.window.init()

    this.renderMenu()
  }
  
  async destroy() {
    // TODO: должен вызываться из Renderer
  }


  handleIncomeCallbackQuery(queryData: string) {
    if (!queryData) {
      this.main.log.warn(`Empty data came in callback query to chat: ${this.chatId}, bot: ${this.botId}`)

      return
    }

    //this.window.handleUiEvent(UI_EVENTS.click, queryData)
  }

  handleIncomeTextEvent(msgEvent: TextMessageEvent) {
    // TODO: нужно отправить это в элемент в фокусе
    //this.window.handleUiEvent(UI_EVENTS.input, msgEvent)
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

  private renderMenu() {
    (async () => {
      await this.main.tg.sendTextMessage(
        this.botId,
        this.chatId,
        'text',
        {
          reply_markup: {
            // TODO: add buttons
            inline_keyboard: [
              [
                {
                  text: 'btn1',
                  callback_data: 'some',
                }
              ]
            ]
          }
        }
      )

      //
      // const [messageHtml, buttons] = convertDocumentToTgUi(this.window.rootDocument)
      //
      // if (typeof this.menuMsgId !== 'undefined') {
      //   await this.main.tg.deleteMessage(this.botToken, this.botChatId, this.menuMsgId)
      // }
      //
      // const sentMessage = await this.main.tg.sendTextMessage(
      //   this.botToken,
      //   this.botChatId,
      //   messageHtml,
      //   {
      //     parse_mode: TG_PARSE_MODE,
      //     reply_markup: {
      //       inline_keyboard: buttons
      //     },
      //     disable_web_page_preview: true,
      //   },
      // )
      //
      // this.menuMsgId = sentMessage.message_id
    })()
      .catch((e) => this.main.log.error(e))
  }

}
