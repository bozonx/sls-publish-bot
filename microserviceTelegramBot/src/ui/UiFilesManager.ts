import {Main} from '../Main.js';
import {WindowConfig} from '../../../src/AbstractUi/interfaces/WindowConfig.js';


export class UiFilesManager {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  async setUi(botId: string, uiFiles: string) {
    // TODO: parse uiFiles and save them to disk
  }

  async removeUi(botId: string) {
    // TODO: add
  }

  async loadWindowConfig(botId: string): Promise<WindowConfig> {
    // TODO: load from storage all the ui files

    return {
      currentPath: '/',
      routes: []
    }
  }

  async deleteWindowConfig(botToken: string) {

  }

}
