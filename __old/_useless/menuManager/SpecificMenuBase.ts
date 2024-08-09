import {MenuDefinition} from './MenuManager';
import {MenuItem, MenuItemContext} from '../../src/types/MenuItem';
import BreadCrumbs from '../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/BreadCrumbs';


export interface MenuStep extends MenuDefinition {
  state: Record<string, any>
}


export class SpecificMenuBase {
  breadCrumbs: BreadCrumbs


  constructor() {
    const initialStep = async () => {
      // TODO: что тут должно быть???
    }

    this.breadCrumbs = new BreadCrumbs(initialStep)
  }

  // steps: MenuStep[] = []
  //
  //
  // getStep(stepName: string): MenuStep | undefined {
  //   return this.steps
  //     .reverse()
  //     .find((el) => el.name === stepName)
  // }
  //
  // addStep(step: MenuStep) {
  //
  // }
  //
  // async runStep() {
  //   // TODO: end prev step
  // }

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