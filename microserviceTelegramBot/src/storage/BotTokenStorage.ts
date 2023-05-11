import {Main} from '../Main.js';


export interface BotStorageInfo {
  botId: string
  token: string
  created: string
}

export interface ChatStorageInfo {
  botId: string
  chatId: string | number
}


export class BotTokenStorage {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  /**
   * Load all the bot tokens like - bot
   */
  async loadAllBots(): Promise<BotStorageInfo[]> {
    // TODO: если нет директории long - то ошибка
    // TODO: это должна быть база данных !!!
    // TODO: если нет директории с токенами то значит нет токенов

    // TODO: load all the tokens
  }

  async loadChatInfo(botId: string): Promise<ChatStorageInfo> {

  }

}
