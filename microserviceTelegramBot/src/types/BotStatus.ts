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
