import {isPromise} from 'squidlet-lib';
import {compactUndefined} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';


export interface MenuDefinition {
  path: string,
  messageHtml: string
}

export type MenuChangeHandler = (menuDefinition: MenuDefinition) => (undefined | MenuItem | Promise<MenuItem>)



export class MenuManager {
  private registeredHandlers: MenuChangeHandler[] = []


  get handlers(): MenuChangeHandler[] {
    return compactUndefined(this.registeredHandlers)
  }

  onMenuChange(handler: MenuChangeHandler): number {
    this.registeredHandlers.push(handler)

    return this.registeredHandlers.length - 1
  }

  removeHandler(handlerIndex: number) {
    delete this.registeredHandlers[handlerIndex]
  }

  async collectCurrentItems(currentDefinition: MenuDefinition): Promise<MenuItem[]> {
    const items: MenuItem[] = []
    const handlers: MenuChangeHandler[] = this.handlers

    for (const handler of handlers) {
      const res: undefined | MenuItem | Promise<MenuItem> = handler(currentDefinition)

      if (typeof res === 'undefined') continue

      if (isPromise(res)) {
        items.push(await res)
      }
      else {
        items.push(res as MenuItem)
      }
    }

    return items
  }

}
