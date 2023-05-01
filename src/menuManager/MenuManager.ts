import {isPromise} from 'squidlet-lib';
import {compactUndefined} from 'squidlet-lib';
import {MenuItem, MenuItemContext} from '../types/MenuItem.js';
import App from '../App.js';


export const MENU_DELIMITER = '/'


export interface MenuDefinition {
  path: string,
  messageHtml: string
}

export type MenuChangeHandler = (menuDefinition: MenuDefinition) => (undefined | MenuItem[] | Promise<MenuItem[]>)



export class MenuManager {
  private readonly app

  private registeredHandlers: MenuChangeHandler[] = []


  get handlers(): MenuChangeHandler[] {
    return compactUndefined(this.registeredHandlers)
  }


  constructor(app: App) {
    this.app = app
  }


  onMenuChange(handler: MenuChangeHandler): number {
    this.registeredHandlers.push(handler)

    return this.registeredHandlers.length - 1
  }

  removeHandler(handlerIndex: number) {
    delete this.registeredHandlers[handlerIndex]
  }

  async collectCurrentItems(currentDefinition: MenuDefinition): Promise<MenuItem[]> {
    let items: MenuItem[] = []
    const handlers: MenuChangeHandler[] = this.handlers

    for (const handler of handlers) {
      const res: undefined | MenuItem[] | Promise<MenuItem[]> = handler(currentDefinition)

      if (typeof res === 'undefined') continue

      const newItems: MenuItem[] = (isPromise(res)) ? await res : res as MenuItem[]

      items = [...items, ...newItems]
    }

    if (currentDefinition.path) {
      const pathSplat = currentDefinition.path.split(MENU_DELIMITER)

      if (pathSplat.length === 1) {
        items.push(this.makeBackToMainMenuBtn())
      }
      else if (pathSplat.length > 2) {
        items.push(this.makeBackBtn())
        items.push(this.makeCancelBtn())
      }
    }

    return items
  }


  private makeBackToMainMenuBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.toMainMenu},
      async pressed(itemCtx: MenuItemContext): Promise<void> {

      }
    }
  }

  private makeBackBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.back},
      async pressed(itemCtx: MenuItemContext): Promise<void> {

      }
    }
  }

  private makeCancelBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.cancel},
      async pressed(itemCtx: MenuItemContext): Promise<void> {

      }
    }
  }

}
