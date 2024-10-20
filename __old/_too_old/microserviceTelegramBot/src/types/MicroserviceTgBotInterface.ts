import {BotStatus} from './BotStatus';


export interface MicroserviceTgBotInterface {
  newBot(botToken: string): Promise<string>
  // returns bot status or null if bot isn't registered
  botStatus(botId: string): Promise<BotStatus | null>
  setUi(botId: string, uiFiles: string): Promise<void>
  removeBot(botId: string): Promise<void>

  // TODO: add methods to send messages
}
