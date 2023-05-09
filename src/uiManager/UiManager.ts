import System from '../System.js';
import {UiMain} from './UiMain.js';
import {NotifyAll} from './NotifyAll.js';


export class UiManager {
  system: System
  notifyAll: NotifyAll
  // TODO: сделать это через отдельный класс, который будет сортировать ф-и инициализации
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []
  private destroyQueue: {cb: () => Promise<void>, before?: string[]}[] = []
  private uiInstances: UiMain[] = []


  get uis(): UiMain[] {
    return this.uiInstances
  }


  constructor(system: System) {
    this.system = system

    this.notifyAll = new NotifyAll(this)
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

    for (const ui of this.uiInstances) {
      await ui.destroy()
    }
  }

  newUi(): UiMain {
    const ui = new UiMain(this)

    this.uiInstances.push(ui)

    return ui
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
