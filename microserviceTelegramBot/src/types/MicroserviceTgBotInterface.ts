export interface BotStatus {
  registered: boolean
  // listening to events from telegram
  listening: boolean
  // ISO date time of last set of UI
  lastUiUpdate: string
  // ISO date time of last access to bot by user
  lastAccess: string
  // ISO date time of last income event
  lastEvent: string
  // ISO date time  of bot was created
  created: string
}


export interface MicroserviceTgBotInterface {
  newBot(botToken: string): Promise<string>
  botStatus(botId: string): Promise<BotStatus>
  setUi(botId: string, uiFiles: string): Promise<void>
  removeBot(botId: string): Promise<void>
}