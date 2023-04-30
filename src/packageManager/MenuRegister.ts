import {objSetMutate} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';


export type MenuChangeHandler = (
  menuPath: string,
  registerItem: (item: MenuItem) => void
) => Promise<void>


export class MenuRegister {
  //private menuObj: Record<string, any> = {}
  // TODO: а как их удалять если нужно???
  private registeredHandlers: MenuChangeHandler[] = []


  async init() {
    const rootPath: string = ''

    await this.toPath(rootPath)
  }

  async destroy() {

  }


  onMenuChange(handler: MenuChangeHandler) {
    this.registeredHandlers.push(handler)
  }

  // addMenuItem(pathToMenu: string, itemName: string, menuItem: MenuItem) {
  //   objSetMutate(this.menuObj, pathToMenu + '.' + itemName, menuItem)
  //
  //   console.log(111, this.menuObj)
  // }

  async toPath(menuPath: string) {
    const items: MenuItem[] = []

    for (const handler of this.registeredHandlers) {
      await handler(menuPath, (item: MenuItem) => items.push(item))
    }
  }
}
