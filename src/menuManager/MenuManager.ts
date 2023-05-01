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

}
