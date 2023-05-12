import {Main} from '../Main.js';
import {BotStorageInfo, ChatStorageInfo, DB_CHATS_COLS, DB_TABLES} from '../types/dbTypes.js';


// TODO: сделать небольшой кэш для данных из бд


export class ChatStorage {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  /**
   * Load all the bot tokens like - bot
   */
  async getAllBots(): Promise<BotStorageInfo[]> {
    return await this.main.db.getAll<BotStorageInfo>(DB_TABLES.bots)
  }

  async getBotChats(botId: string): Promise<ChatStorageInfo[]> {
    return await this.main.db.getAllByKey<ChatStorageInfo>(
      DB_TABLES.chats,
      DB_CHATS_COLS.botId,
      botId
    )
  }

  async saveChat(botId: string, chatId: string) {
    // TODO: if it exists do nothing

    await this.main.db.insertRecord()
  }

  async saveBot(botToken: string, botId: string) {
    // TODO: если уже есть бот то ничего не делаем

  }

  async removeBot(botId: string) {
    // TODO: remove if exist
    // TODO: and it's chats
    // TODO: and all chat's info

  }

}
