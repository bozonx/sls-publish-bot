import {IndexedEvents} from 'squidlet-lib';


export const BREADCRUMBS_DELIMITER = '/'


export interface BreadCrumbsStep {
  // Name of the step. It is part of path
  name: string
  state: Record<string, any>
  // // It will be called when step is started
  // onStart(state: Record<string, any>): Promise<void>
  // // It will be called when step is finished (the next is added)
  // onEnd(state: Record<string, any>): Promise<void>
  // // It will be called on canceling step or if is going to switch to previous one
  // onCancel(state: Record<string, any>): Promise<void>
}

export default class BreadCrumbs {
  pathChangeEvent: IndexedEvents<() => void> = new IndexedEvents()
  private currentStepId: string = '0'
  private steps: BreadCrumbsStep[] = []


  constructor() {
  }

  destroy() {
    // clear all the steps
    this.deleteStepAndAfter(0)
  }


  getCurrentPath(): string {
    return this.getPathOfStepId(this.currentStepId)
  }

  getPathOfStepId(stepId: string): string {
    const names: string[] = this.steps.map((el) => el.name)
    // TODO: проверить
    const sliced: string[] = names.splice(0, Number(this.currentStepId) + 1)

    return sliced.join(BREADCRUMBS_DELIMITER)
  }

  /**
   * Add step to current path
   * @param name
   * @param initialState
   */
  addStep(name: string, initialState: Record<any, any> = {}): string {
    const stepId = String(this.steps.length)

    this.steps.push({
      name,
      state: initialState,
    })

    this.currentStepId = stepId

    this.pathChangeEvent.emit()

    return this.currentStepId
  }

  toPath(newPath: string): string {
    this.steps = []

    const pathNames: string[] = newPath.split(BREADCRUMBS_DELIMITER)

    // TODO: что будет в случае рута???

    for (const name of pathNames) {
      this.steps.push({
        name,
        state: {},
      })
    }

    this.currentStepId = String(pathNames.length - 1)

    this.pathChangeEvent.emit()

    return this.currentStepId
  }

  // /**
  //  * Add a step and run it
  //  */
  // async addAndRunStep(step: BreadCrumbsStep) {
  //   this.steps.push(step)
  //
  //   const stepIndex = this.steps.length -1
  //
  //   try {
  //     // normally end prev step
  //     if (stepIndex > 0) {
  //       await this.justEndStep(stepIndex - 1)
  //     }
  //     // run current step
  //     await this.justExecuteStep(stepIndex)
  //   }
  //   catch (e) {
  //     this.deleteStepAndAfter(stepIndex)
  //
  //     throw e
  //   }
  // }

  /**
   * Switch to certain step by it's id.
   * It removes all the other steps which are after it
   */
  async to(stepName: string) {
    const stepIndex = this.steps.findIndex((e) => e.name === stepName);

    if (stepIndex < 0) {
      return this.cancel()
    }

    return this.runStepByIndex(stepIndex)
  }

  async back() {
    // go to initial if no steps
    if (this.steps.length < 1) return this.initialStep()

    const currentStepIndex = this.steps.length - 1
    // cancel current step
    await this.justCancelStep(currentStepIndex)
    // remove current step
    this.deleteStepAndAfter(currentStepIndex)

    const newCurrentStepIndex = this.steps.length - 1

    if (this.steps.length) {
      // if it has some other steps - run the last
      return this.justExecuteStep(newCurrentStepIndex)
    }
    // if no steps - run initial step
    return this.initialStep()
  }

  async cancel() {
    // if it is alreasy initial step - do notging.
    if (!this.steps.length) return

    const currentStepIndex = this.steps.length - 1
    // cancel current step
    await this.justCancelStep(currentStepIndex)
    // clear all the steps
    this.deleteStepAndAfter(0)
    // go to initial state
    await this.initialStep()
  }


  /**
   * Run step which is in step stack.
   * Removes steps after specified and start it
   */
  private async runStepByIndex(stepIndex: number) {
    if (stepIndex < this.steps.length -1) {
      // run one of the previous steps
      // cancel currently running step
      await this.justCancelStep(this.steps.length - 1)
      // remove steps after specified
      this.deleteStepAndAfter(stepIndex + 1)
      // run specified state
      return this.justExecuteStep(stepIndex)
    }
    else if (this.steps.length -1 === stepIndex) {
      // restart current step which is the last step
      // just cancel current step
      await this.justCancelStep(stepIndex)
      // just run current step
      return this.justExecuteStep(stepIndex)
    }

    throw new Error(`Wrong stepNum ${stepIndex}`)
  }

  /**
   * Just delete step and those which after it
   */
  private deleteStepAndAfter(stepIndex: number) {
    // if index less than specified
    if (this.steps.length -1 < stepIndex) return

    this.steps.splice(stepIndex)
  }

  private justExecuteStep(stepNum: number): Promise<void> {
    return this.steps[stepNum].onStart(this.steps[stepNum].state);
  }

  private justEndStep(stepNum: number): Promise<void> {
    return this.steps[stepNum].onEnd(this.steps[stepNum].state);
  }

  private justCancelStep(stepNum: number): Promise<void> {
    return this.steps[stepNum].onCancel(this.steps[stepNum].state);
  }

}
