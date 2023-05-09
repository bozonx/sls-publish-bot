import System from '../System.js';
import {UiContext} from './UiContext.js';
import {WindowConfig} from '../AbstractUi/interfaces/WindowConfig.js';
import {Window} from '../AbstractUi/Window.js';
import {UiMain} from './UiMain.js';


export class UiManager {
  system: System
  uiContext: UiContext
  // TODO: сделать это через отдельный класс, который будет сортировать ф-и инициализации
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []
  private destroyQueue: {cb: () => Promise<void>, before?: string[]}[] = []


  constructor(system: System) {
    this.system = system
    this.uiContext = new UiContext(this)
  }


  newUi(): UiMain {
    // TODO: add
    const windowConfig: WindowConfig = {
      currentPath: '/',
      routes: this.routes
    }

    return new Window(windowConfig)
  }

  /**
   * On any UI instance init
   * @param cb
   * @param after
   */
  onUiInit(cb: () => Promise<void>, after?: string[]) {
    this.initQueue.push({
      cb,
      after
    })
  }

  /**
   * On any UI instance destroy
   * @param cb
   * @param before
   */
  onUiDestroy(cb: () => Promise<void>, before?: string[]) {
    this.destroyQueue.push({
      cb,
      before
    })
  }

}
