import {MenuDefinition} from './MenuManager.js';
import {MenuItem, MenuItemContext} from '../types/MenuItem.js';


export interface MenuStep extends MenuDefinition {
  state: Record<string, any>
}


export class SpecificMenuBase {
  steps: MenuStep[] = []


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

}