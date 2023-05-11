import {BotStatus, MicroserviceTgBotInterface} from './types/MicroserviceTgBotInterface.js';
import {Main} from './Main.js';


export class ServiceInterface implements MicroserviceTgBotInterface {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  newBot(botToken: string): Promise<string> {

  }

  botStatus(botId: string): Promise<BotStatus> {

  }

  setUi(botId: string, uiFiles: string): Promise<void> {

  }

  removeBot(botId: string): Promise<void> {

  }

}