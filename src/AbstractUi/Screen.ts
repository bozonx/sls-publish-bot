import {Document} from './Document.js';
import {Window} from './Window.js';


export class Screen {
  readonly document = new Document()

  private readonly window: Window


  constructor(window: Window) {
    this.window = window
  }


  async destroy() {
    await this.document.destroy()
  }

}