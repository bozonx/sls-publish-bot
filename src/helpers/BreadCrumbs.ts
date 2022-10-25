
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


  addStep(step: BreadCrumbsStep): number {
    this.steps.push(step);

    if (this.steps.length < 1) throw new Error(`Step didn't added`);

    return this.steps.length - 1;
  }

  async startStep(stepNum: number) {
    await this.executeStep(stepNum);
  }

  /**
   * Remove steps after specified and start it
   * @param stepNum
   */
  async toStep(stepNum: number) {
    if (this.steps.length < 1) throw new Error(`Steps are empty`);
    else if (!this.steps[stepNum]) throw new Error(`Can't find the step ${stepNum}`);
    // stop current step
    await this.stopAndDeleteStep(this.steps.length - 1);
    // remove steps after it
    this.deleteStepAndAfter(stepNum + 1);
    // start specified step
    await this.executeStep(stepNum);
  }

  async back() {
    if (this.steps.length < 1) throw new Error(`Steps are empty`);
    // stop current step
    await this.stopAndDeleteStep(this.steps.length - 1);

    if (this.steps.length) {
      // start specified step
      await this.executeStep(this.steps.length - 1);
    }
    else {
      await this.initialStep();
    }
  }

  async cancel() {
    if (this.steps.length) {
      // stop current step
      await this.stopAndDeleteStep(this.steps.length - 1);
      // clear steps
      this.deleteStepAndAfter(0);
    }

    await this.initialStep();
  }


  /**
   * Stop previous step and execute specified.
   * It runs onStart callback of step
   */
  private async executeStep(stepNum: number) {
    // TODO: WTF???
    await this.stopAndDeleteStep(stepNum);

    return this.steps[stepNum].onStart(this.steps[stepNum].state);
  }

  /**
   * Run onStop callback and remove step
   */
  private async stopAndDeleteStep(stepNum: number) {
    await this.steps[stepNum].onStop(this.steps[stepNum].state);

    this.deleteStepAndAfter(stepNum);
  }

  private deleteStepAndAfter(stepNum: number) {
    if (this.steps.length -1 < stepNum) return;

    this.steps.splice(stepNum);
  }

}
