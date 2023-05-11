import {TgChat} from './TgChat.js';
import {Main} from '../Main.js';
import {makeBotId} from '../../../src/helpers/makeBotId.js';
import {BotStatus} from '../types/MicroserviceTgBotInterface.js';
import {BotStorageInfo} from '../storage/BotTokenStorage.js';


const CHAT_DELIMITER = '|'


export class BotsManager {
  readonly main: Main
  // {"botId|chatId": TgChat}
  private readonly chats: Record<string, TgChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    const botTokens: BotStorageInfo[] = await this.main.botTokenStorage.getAllBots()

    for (const item of botTokens) {
      const botChatIds = await this.main.botTokenStorage.getBotChats(item.botId)

      for (const chat of botChatIds) {
        await this.initChat(item.botId, item.token, chat.chatId)
      }
    }

    this.listenChatStart()
  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy()

      delete this.chats[itemIndex]
    }
  }


  newBot(botToken: string): string {
    const botId = makeBotId(testBotToken)
    // TODO: если уже есть бот то ничего не делаем
    // TODO: сохранить связку в хранилище

    //this.telegramManager.registerBot(botToken)

    return botId
  }

  async removeBot(botId: string) {
    // TODO: add un register
    // TODO: add remove storage
  }

  async botStatus(botId: string): Promise<BotStatus> {

  }


  private async initChat(botId: string, botToken: string, chatId: string) {

  }

  private listenChatStart() {

    // TODO: хотя если уже существует то можно прибить чат и создать инстанс заного

    this.main.tg.onCmdStart((botToken: string, chatId: string) => {
      const id = botId + CHAT_DELIMITER + chatId

      if (!this.chats[id]) {
        this.chats[id] = new TgChat(this, botToken, chatId)
      }

      this.chats[id].init()
        .catch((e) => this.main.log.error(e));
    })
  }

}
