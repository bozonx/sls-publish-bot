export interface BotStatus {
  // listening to events from telegram
  listening: boolean
  // ISO date time  of bot was created
  created: string
  // ISO date time of last set of UI
  lastUiUpdate?: string
  // ISO date time of last access to bot by user
  lastAccess?: string
  // ISO date time of last income event
  lastEvent?: string
}


export interface MicroserviceTgBotInterface {
  newBot(botToken: string): Promise<string>
  // returns bot status or null if bot isn't registered
  botStatus(botId: string): Promise<BotStatus | null>
  setUi(botId: string, uiFiles: string): Promise<void>
  removeBot(botId: string): Promise<void>
}
