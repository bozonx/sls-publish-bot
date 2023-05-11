import {TgChat} from './TgChat.js';
import {Main} from '../Main.js';
import {makeBotId} from '../../../src/helpers/makeBotId.js';
import {BotStatus} from '../types/MicroserviceTgBotInterface.js';


const CHAT_DELIMITER = '|'


export class TelegramManager {
  readonly main: Main
  // {"botToken|chatId": TgChat}
  private readonly chats: Record<string, TgChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    this.main.tg.onCmdStart((botToken: string, chatId: number | string) => {
      const id = botToken + CHAT_DELIMITER + chatId

      if (!this.chats[id]) {
        this.chats[id] = new TgChat(this, botToken, chatId)
      }

      this.chats[id].init()
        .catch((e) => this.main.log.error(e));
    })
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

}
