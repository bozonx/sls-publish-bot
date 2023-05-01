import {isPromise, compactUndefined} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';
import App from '../App.js';


export interface MenuDefinition {
  // this is a part of path
  name: string,
  messageHtml?: string
  // params which is set only once by plugin, it isn't state
  //params?: Record<string, any>
}

export type MenuChangeHandler = (menuDefinition: MenuDefinition) =>
  (undefined | MenuItem[][] | Promise<MenuItem[][]>)


export class MenuManager {
  private readonly app
  private registeredHandlers: MenuChangeHandler[] = []


  get handlers(): MenuChangeHandler[] {
    return compactUndefined(this.registeredHandlers)
  }


  constructor(app: App) {
    this.app = app
  }

  async destroy() {
  }


  onMenuChange(handler: MenuChangeHandler): number {
    this.registeredHandlers.push(handler)

    return this.registeredHandlers.length - 1
  }

  removeHandler(handlerIndex: number) {
    delete this.registeredHandlers[handlerIndex]
  }

  async collectCurrentItems(currentDefinition: MenuDefinition): Promise<MenuItem[][]> {
    let items: MenuItem[][] = []
    const handlers: MenuChangeHandler[] = this.handlers

    for (const handler of handlers) {
      const res: undefined | MenuItem[][] | Promise<MenuItem[][]> = handler(currentDefinition)

      if (typeof res === 'undefined') continue

      const newItems: MenuItem[][] = (isPromise(res)) ? await res : res as MenuItem[][]

      items = [...items, ...newItems]
    }

    return items
  }

}
