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
  created: 'created',
}

export const DB_CHATS_COLS: Record<keyof ChatStorageInfo, keyof ChatStorageInfo> = {
  botId: 'botId',
  chatId: 'chatId',
  created: 'created',
}
