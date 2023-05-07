import {Document} from './Document.js';
import {Window} from './Window.js';
import {UiState} from './UiState.js';


export class Screen {
  readonly document = new Document()
  readonly state = new UiState()

  private readonly window: Window


  constructor(window: Window) {
    this.window = window
  }

  async init() {

  }

  async destroy() {
    await this.document.destroy()
  }

}
