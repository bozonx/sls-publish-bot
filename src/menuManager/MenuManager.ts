import {isPromise, compactUndefined, IndexedEvents} from 'squidlet-lib';
import {MenuItem, MenuItemContext} from '../types/MenuItem.js';
import App from '../App.js';


export interface MenuDefinition {
  // this is a part of path
  name: string,
  messageHtml?: string
  state: Record<string, any>
}

export type MenuChangeHandler = (menuDefinition: MenuDefinition) =>
  (undefined | MenuItem[][] | Promise<MenuItem[][]>)

export enum MenuEvents {
  toMainMenu,
  back,
  cancel,
}

export const MENU_DELIMITER = '/'


export class MenuManager {
  private actionEvents = new IndexedEvents<
    (eventName: MenuEvents) => void
  >()
  private readonly app
  private steps: MenuDefinition[] = []

  private registeredHandlers: MenuChangeHandler[] = []


  get handlers(): MenuChangeHandler[] {
    return compactUndefined(this.registeredHandlers)
  }


  constructor(app: App) {
    this.app = app
  }

  async destroy() {
    this.actionEvents.destroy()
  }


  getState(stepName: string): Record<string, any> | undefined {
    return this.getStep(stepName)?.state
  }

  setState(stepName: string, newState: Record<string, any>, replace: boolean = false) {
    const foundStep = this.getStep(stepName)

    if (!foundStep) return

    if (replace) {
      foundStep.state = newState
    }
    else {
      foundStep.state = {...foundStep.state, ...newState}
    }
  }

  getStep(stepName: string): MenuDefinition | undefined {
    return this.steps
      .reverse()
      .find((el) => el.name === stepName)
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

    if (this.steps.length === 1 && this.steps[0].name !== '') {
      items.push([this.makeBackToMainMenuBtn()])
    }
    else if (this.steps.length > 1) {
      items.push([this.makeBackBtn()])
      items.push([this.makeCancelBtn()])
    }

    return items
  }


  private makeBackToMainMenuBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.toMainMenu},
      pressed: async (itemCtx: MenuItemContext) => {
        this.actionEvents.emit(MenuEvents.toMainMenu)
      }
    }
  }

  private makeBackBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.back},
      pressed: async (itemCtx: MenuItemContext) => {
        this.actionEvents.emit(MenuEvents.back)
      }
    }
  }

  private makeCancelBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.cancel},
      pressed: async (itemCtx: MenuItemContext) => {
        this.actionEvents.emit(MenuEvents.cancel)
      }
    }
  }

}
