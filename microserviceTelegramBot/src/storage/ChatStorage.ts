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
    return await this.main.longDb.getAll<BotStorageInfo>(DB_TABLES.bots)
  }

  async getBotChats(botId: string): Promise<ChatStorageInfo[]> {
    return await this.main.longDb.getAllByKey<ChatStorageInfo>(
      DB_TABLES.chats,
      DB_CHATS_COLS.botId,
      botId
    )
  }

  async saveChat(botId: string, chatId: string) {
    const exists = await this.main.longDb.exists(DB_TABLES.chats, chatId)

    if (exists) return

    const data: Omit<ChatStorageInfo, 'created'> = { botId, chatId }

    await this.main.longDb.create(DB_TABLES.chats, data)
  }

  async saveBot(token: string, botId: string) {
    const exists = await this.main.longDb.exists(DB_TABLES.bots, botId)

    if (exists) return

    const data: Omit<BotStorageInfo, 'created'> = { botId, token }

    await this.main.longDb.create(DB_TABLES.bots, data)
  }

  async removeBot(botId: string) {
    const exists = await this.main.longDb.exists(DB_TABLES.bots, botId)

    if (exists) {
      await this.main.longDb.delete(DB_TABLES.bots, botId)
    }

    await this.main.longDb.deleteAll(
      DB_TABLES.chats,
      `${DB_CHATS_COLS.botId} = ${botId}`
    )
  }

}
