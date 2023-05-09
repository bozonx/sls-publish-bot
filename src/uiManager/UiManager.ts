import System from '../System.js';
import {UiMain} from './UiMain.js';


export class UiManager {
  system: System
  // TODO: сделать это через отдельный класс, который будет сортировать ф-и инициализации
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []
  private destroyQueue: {cb: () => Promise<void>, before?: string[]}[] = []


  constructor(system: System) {
    this.system = system
  }

  async init() {
    for (const item of this.initQueue) {
      // TODO: handle error
      await item.cb()
      // TODO: use after
    }
  }

  async destroy() {
    for (const item of this.destroyQueue) {
      // TODO: handle error
      await item.cb()
      // TODO: use bedore
    }
  }

  newUi(): UiMain {
    return new UiMain(this)
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
