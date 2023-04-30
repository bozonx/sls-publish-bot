import {MenuItem} from '../types/MenuItem.js';


export type MenuChangeHandler = (
  menuPath: string,
  registerItem: (item: MenuItem) => void
) => Promise<void>


export class MenuManager {
  currentPath: string = ''
  currentMenu: MenuItem[] = []
  //private menuObj: Record<string, any> = {}
  // TODO: а как их удалять если нужно???
  private registeredHandlers: MenuChangeHandler[] = []



  async init() {
    await this.toPath(this.currentPath)
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

    this.currentMenu = items
  }

}
