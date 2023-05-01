import {compactUndefined} from 'squidlet-lib';
import {MenuItem} from '../types/MenuItem.js';


export type MenuChangeHandler = (menuPath: string) => (MenuItem | Promise<MenuItem>)


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

}
