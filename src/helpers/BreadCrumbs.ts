export interface BreadCrumbsStep {
  // It will be called when step is started
  onStart(state: Record<string, any>): Promise<void>
  // It will be called when step is finished (the next is added)
  onEnd(state: Record<string, any>): Promise<void>
  // It will be called on canceling step or if is going to switch to previous one
  onCancel(state: Record<string, any>): Promise<void>
  state: Record<string, any>
  // optional step name which is used to switch to certain step
  name?: string
}


export default class BreadCrumbs {
  private readonly steps: BreadCrumbsStep[] = []
  private readonly initialStep: () => Promise<void>


  constructor(initialStep: () => Promise<void>) {
    this.initialStep = initialStep;
    // TODO: использовать логгер
  }

  destroy() {
    // clear all the steps
    this.deleteStepAndAfter(0)
    //delete this.initialStep
  }


  /**
   * Add a step and run it
   */
  async addAndRunStep(step: BreadCrumbsStep): Promise<number> {
    this.steps.push(step);

    if (this.steps.length < 1) throw new Error(`Step didn't added`);

    const stepNum = this.steps.length -1;

    try {
      // normally end prev step
      if (stepNum > 0) {
        await this.justEndStep(stepNum - 1);
      }
      // run current step
      await this.justExecuteStep(stepNum);
    }
    catch (e) {
      // TODO: review
      // TODO: или может запустить stop. Или разрешить ошибку
      this.deleteStepAndAfter(stepNum)

      throw e
    }

    return stepNum
  }

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
    if (this.steps.length) {
      const currentStepIndex = this.steps.length - 1
      // cancel current step
      await this.justCancelStep(currentStepIndex)
      // clear all the steps
      this.deleteStepAndAfter(0)
    }

    await this.initialStep()
  }


  /**
   * Run step which is in step stack.
   * Removes steps after specified and start it
   */
  private async runStepByIndex(stepIndex: number) {
    if (this.steps.length -1 < stepIndex) {
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
