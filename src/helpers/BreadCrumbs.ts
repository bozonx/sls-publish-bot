
export interface BreadCrumbsStep {
  // It will be called when step is started
  onStart(state: Record<string, any>): Promise<void>;
  // It will be called when step is
  //   finished or cancel or back button is pressed
  onStop(state: Record<string, any>): Promise<void>;
  state: Record<string, any>;
}


export default class BreadCrumbs {
  private steps: BreadCrumbsStep[] = [];
  private readonly initialStep: () => Promise<void>;


  constructor(initialStep: () => Promise<void>) {
    this.initialStep = initialStep;
  }


  /**
   * Add a step and run it
   */
  async addAndRunStep(step: BreadCrumbsStep): Promise<number> {
    this.steps.push(step);

    if (this.steps.length < 1) throw new Error(`Step didn't added`);

    const stepNum = this.steps.length -1;

    try {
      await this.justExecuteStep(stepNum);
    }
    catch (e) {
      // TODO: или может запустить stop. Или разрешить ошибку
      this.deleteStepAndAfter(stepNum);

      throw e;
    }

    return stepNum;
  }

  /**
   * Run step which is in step stack.
   * Removes steps after specified and start it
   */
  async runStep(stepNum: number) {
    if (this.steps.length -1 < stepNum) {
      // run one of previous steps
      // stop currently running step
      await this.justStopStep(this.steps.length - 1);
      // remove steps after specified
      this.deleteStepAndAfter(stepNum + 1);
      // run specified state
      return this.justExecuteStep(stepNum);
    }
    else if (this.steps.length -1 === stepNum) {
      // run current step
      // restart current step
      // just stop current step
      await this.justStopStep(stepNum);
      // just run current step
      return this.justExecuteStep(stepNum);
    }

    throw new Error(`Wrong stepNum ${stepNum}`);
  }

  async back() {
    // do nothing if no steps
    if (this.steps.length < 1) return;

    const currentStep = this.steps.length - 1;
    // stop current step
    await this.justStopStep(currentStep);
    // remove current step
    this.deleteStepAndAfter(currentStep);

    const newCurrentStep = this.steps.length - 1;

    if (this.steps.length) {
      // if it has some other steps - run the last
      await this.justExecuteStep(newCurrentStep);
    }
    else {
      // if no steps - run initial step
      await this.initialStep();
    }
  }

  async cancel() {
    if (this.steps.length) {
      const currentStep = this.steps.length - 1;
      // stop current step
      await this.justStopStep(currentStep);
      // clear all the steps
      this.deleteStepAndAfter(0);
    }

    await this.initialStep();
  }


  /**
   * Just delete step and those which after it
   */
  private deleteStepAndAfter(stepNum: number) {
    if (this.steps.length -1 < stepNum) return;

    this.steps.splice(stepNum);
  }

  private justExecuteStep(stepNum: number): Promise<void> {
    return this.steps[stepNum].onStart(this.steps[stepNum].state);
  }

  private justStopStep(stepNum: number): Promise<void> {
    return this.steps[stepNum].onStop(this.steps[stepNum].state);
  }

}
