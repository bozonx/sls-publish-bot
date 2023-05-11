import {TgChat} from './TgChat.js';
import {Main} from '../Main.js';
import {makeBotId} from '../../../src/helpers/makeBotId.js';
import {BotStatus} from '../types/MicroserviceTgBotInterface.js';
import {BotStorageInfo} from '../storage/ChatStorage.js';



export class BotsManager {
  readonly main: Main
  // {"chatId": TgChat}
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
    }

    this.listenNewChatsStart()
  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy()

      delete this.chats[itemIndex]
    }
  }


  async newBot(botToken: string): Promise<string> {
    const botId = makeBotId(botToken)

    await this.main.chatStorage.saveBot(botToken, botId)
    await this.main.tg.listenToStartBot(botToken, botId)

    return botId
  }

  async removeBot(botId: string) {
    // TODO: add un register
    // TODO: add remove storage
  }

  async botStatus(botId: string): Promise<BotStatus> {
    // TODO: add !!!
    return {} as any
  }


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
        await this.initChat(botId, chatId)
      })().catch((e) => this.main.log.error(e))
    })
  }

  private async initChat(botId: string, chatId: string) {
    this.chats[chatId] = new TgChat(this, botId, chatId)
    // and init it
    await this.chats[chatId].init()
  }

}
