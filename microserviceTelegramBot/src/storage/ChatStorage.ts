import {Main} from '../Main.js';


export interface BotStorageInfo {
  botId: string
  token: string
  created: string
}

export interface ChatStorageInfo {
  botId: string
  chatId: string
  created: string
}


export class ChatStorage {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  /**
   * Load all the bot tokens like - bot
   */
  async getAllBots(): Promise<BotStorageInfo[]> {
    // TODO: если нет директории long - то ошибка
    // TODO: это должна быть база данных !!!
    // TODO: если нет директории с токенами то значит нет токенов

    // TODO: load all the tokens
    // TODO: можно опустить created
  }

  async getBotChats(botId: string): Promise<ChatStorageInfo[]> {

  }

  async saveChat(botId: string, chatId: string) {
    // TODO: if it exists do nothing
  }

}
