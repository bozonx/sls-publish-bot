import {TgChat} from './TgChat.js';
import {Main} from '../Main.js';
import {makeBotId} from '../../../src/helpers/makeBotId.js';
import {BotStatus} from '../types/BotStatus.js';
import {BotStorageInfo} from '../types/dbTypes.js';


export class ChatsManager {
  readonly main: Main
  // like {"chatId": TgChat}
  private readonly chats: Record<string, TgChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    const botTokens: BotStorageInfo[] = await this.main.chatStorage.getAllBots()

    for (const item of botTokens) {
      const botChatIds = await this.main.chatStorage.getBotChats(item.botId)

      for (const chat of botChatIds) {
        await this.initChat(item.botId, chat.chatId)
      }
      // make bot instance and start listeners
      await this.main.tg.initBotAndStartListeners(item.botId, item.token)
    }

    this.listenNewChatsStart()
    this.listenIncomeMessages()
  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy()

      // TODO: удалить листенеры в api

      delete this.chats[itemIndex]
    }
  }


  async newBot(botToken: string): Promise<string> {
    const botId = makeBotId(botToken)

    await this.main.chatStorage.saveBot(botToken, botId)

    // TODO: он должен слушать толко старт или все события???
    //await this.main.tg.listenToStartBot(botToken, botId)

    return botId
  }

  async removeBot(botId: string) {
    for (const chatId of Object.keys(this.chats)) {
      const chat = this.chats[chatId]

      if (chat.botId !== botId) continue

      await this.chats[chatId].destroy()

      delete this.chats[chatId]
    }

    await this.main.chatStorage.removeBot(botId)
  }

  async botStatus(botId: string): Promise<BotStatus> {
    // TODO: add !!!
    return {} as any
  }


  /**
   * Listen of all the bots' start command
   * @private
   */
  private listenNewChatsStart() {
    this.main.tg.onCmdStart((botId: string, chatId: string) => {
      (async () => {
        if (this.chats[chatId]) {
          // destroy chat instance if it exists
          await this.chats[chatId].destroy()
        }
        else {
          // if chat doesn't exists - save it
          await this.main.chatStorage.saveChat(botId, chatId)
        }
        // make a new instance any way
        //await this.initChat(botId, chatId)
      })().catch((e) => this.main.log.error(e))
    })
  }

  /**
   * Listen income messages of all the bots and chats
   * @private
   */
  private listenIncomeMessages() {
    this.main.tg.onIncomeCallbackQuery((botId: string, chatId: string, queryData: string) => {
      if (!this.chats[chatId]) this.chats[chatId].handleIncomeCallbackQuery(queryData)
    })

    // TODO: add other messages types
  }

  private async initChat(botId: string, chatId: string) {

    // TODO: запустить слушание событий в боте

    this.chats[chatId] = new TgChat(this, botId, chatId)
    // and init it
    await this.chats[chatId].init()
  }

}
