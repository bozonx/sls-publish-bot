import System from '../System.js';
import {UiContext} from './UiContext.js';


export class UiManager {
  system: System
  uiContext: UiContext


  constructor(system: System) {
    this.system = system
    this.uiContext = new UiContext(this)
  }


  onUiInit(cb: () => Promise<void>, after?: string[]) {
    // TODO: add
  }

  onUiDestroy(cb: () => Promise<void>, before?: string[]) {
    // TODO: add
  }

}
