import {MenuDefinition} from './MenuManager.js';
import {MenuItem, MenuItemContext} from '../types/MenuItem.js';


export interface MenuStep extends MenuDefinition {
  state: Record<string, any>
}


export class SpecificMenuBase {
  private steps: MenuStep[] = []


  getStep(stepName: string): MenuStep | undefined {
    return this.steps
      .reverse()
      .find((el) => el.name === stepName)
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

  makeSystemBtns(): MenuItem[][] {
    const items: MenuItem[][] = []

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
      }
    }
  }

  private makeBackBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.back},
      pressed: async (itemCtx: MenuItemContext) => {
      }
    }
  }

  private makeCancelBtn(): MenuItem {
    return {
      type: 'button',
      view: {name: this.app.i18n.buttons.cancel},
      pressed: async (itemCtx: MenuItemContext) => {
      }
    }
  }

}