import {Document} from './Document.js';
import {Window} from './Window.js';
import {State} from './State.js';


export class Screen {
  readonly document = new Document()
  readonly state = new State()

  private readonly window: Window


  constructor(window: Window) {
    this.window = window
  }


  async destroy() {
    await this.document.destroy()
  }

}