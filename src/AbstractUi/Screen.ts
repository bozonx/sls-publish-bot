import {Document} from './Document.js';
import {Window} from './Window.js';
import {UiState} from './UiState.js';
import {ScreenDefinition} from './interfaces/ScreenDefinition.js';


export class Screen {
  readonly document = new Document()
  readonly state = new UiState()

  private readonly window!: Window


  constructor(definition: ScreenDefinition) {
  }

  async init(window: Window) {
    this.window = window
    await this.document.init()

    // TODO: должен поднять событие что его надо отрендерить
  }

  async destroy() {
    await this.document.destroy()
  }

}
