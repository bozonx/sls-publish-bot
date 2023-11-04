export const CREATED_COL = 'created'
export const UPDATED_COL = 'updated'

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

export const DB_TABLES = {
  bots: 'bots',
  chats: 'chats',
}

export const DB_BOTS_COLS: Record<keyof BotStorageInfo, keyof BotStorageInfo> = {
  botId: 'botId',
  token: 'token',
  [CREATED_COL]: CREATED_COL,
}

export const DB_CHATS_COLS: Record<keyof ChatStorageInfo, keyof ChatStorageInfo> = {
  botId: 'botId',
  chatId: 'chatId',
  [CREATED_COL]: CREATED_COL,
}
