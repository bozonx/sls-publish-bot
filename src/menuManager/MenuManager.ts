import {compactUndefined, isPromise} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';


export type MenuChangeHandler = (menuPath: string) => (MenuItem | Promise<MenuItem>)


export class MenuManager {
  currentPath: string = ''
  currentMenu: MenuItem[] = []
  private registeredHandlers: MenuChangeHandler[] = []


  async init() {
    await this.toPath(this.currentPath)
  }

  async destroy() {
    // @ts-ignore
    delete this.currentPath
    // @ts-ignore
    delete this.currentMenu
    // @ts-ignore
    delete this.registeredHandlers
  }


  onMenuChange(handler: MenuChangeHandler): number {
    this.registeredHandlers.push(handler)

    return this.registeredHandlers.length - 1
  }

  removeListener(handlerIndex: number) {
    delete this.registeredHandlers[handlerIndex]
  }

  async toPath(menuPath: string) {
    this.currentPath = menuPath

    const items: MenuItem[] = []
    const handlers: MenuChangeHandler[] = compactUndefined(this.registeredHandlers)

    for (const handler of handlers) {
      const res: MenuItem | Promise<MenuItem> = handler(menuPath)

      if (isPromise(res)) {
        items.push(await res)
      }
      else {
        items.push(res as MenuItem)
      }
    }

    this.currentMenu = items
  }

}
