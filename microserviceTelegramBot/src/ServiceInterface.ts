import {MicroserviceTgBotInterface} from './types/MicroserviceTgBotInterface.js';
import {Main} from './Main.js';
import {BotStatus} from './types/BotStatus.js';


export class ServiceInterface implements MicroserviceTgBotInterface {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  async newBot(botToken: string): Promise<string> {
    return this.main.chatsManager.newBot(botToken)
  }

  async botStatus(botId: string): Promise<BotStatus> {
    return this.main.chatsManager.botStatus(botId)
  }

  async setUi(botId: string, uiFiles: string) {
    await this.main.uiFilesManager.setUi(botId, uiFiles)
  }

  async removeBot(botId: string) {
    await this.main.uiFilesManager.removeUi(botId)
    await this.main.chatsManager.removeBot(botId)
  }

}
