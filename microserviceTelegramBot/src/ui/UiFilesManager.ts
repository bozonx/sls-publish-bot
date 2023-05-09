import {Main} from '../Main.js';
import {WindowConfig} from '../../../src/AbstractUi/interfaces/WindowConfig.js';


export class UiFilesManager {
  private readonly main: Main


  constructor(main: Main) {
    this.main = main
  }


  async loadWindowConfig(botToken: string): Promise<WindowConfig> {
    // TODO: load from storage all the ui files
  }

  async deleteWindowConfig(botToken: string) {

  }

}
