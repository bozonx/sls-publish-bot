import {Window} from '../../../../squidlet-ui-builder/src/AbstractUi/Window.js';
import {ChatsManager} from './ChatsManager.js';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../types/MessageEvent.js';
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

    console.log(2222, queryData)

    //this.window.handleUiEvent(UI_EVENTS.click, queryData)
  }

  handleIncomeTextEvent(event: TextMessageEvent) {
    console.log(2222, event)
    // TODO: нужно отправить это в элемент в фокусе
    //this.window.handleUiEvent(UI_EVENTS.input, msgEvent)
  }

  handleIncomePhotoEvent(event: PhotoMessageEvent) {
    console.log(2222, event)
    // try {
    //   this.events.emit(ChatEvents.PHOTO, msgEvent);
    // }
    // catch (e) {
    //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    // }
  }

  handleIncomeVideoEvent(event: VideoMessageEvent) {
    console.log(2222, event)
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

  handleIncomePollEvent(event: PollMessageEvent) {
    console.log(2222, event)
    // try {
    //   this.events.emit(ChatEvents.POLL, msgEvent);
    // }
    // catch (e) {
    //   this.renderer.ctx.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    // }
  }

  private renderMenu() {
    (async () => {
      await this.main.tgApi.sendTextMessage(
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
      //   await this.main.tgApi.deleteMessage(this.botToken, this.botChatId, this.menuMsgId)
      // }
      //
      // const sentMessage = await this.main.tgApi.sendTextMessage(
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
