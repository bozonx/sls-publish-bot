import {IndexedEvents} from 'squidlet-lib'


export const BREADCRUMBS_DELIMITER = '/'
export const BREADCRUMBS_ROOT = '!'


export interface DynamicBreadCrumbsStep {
  // Name of the step. It is part of path
  name: string
  state: Record<string, any>
}

export default class DynamicBreadCrumbs {
  pathChangeEvent: IndexedEvents<() => void> = new IndexedEvents()
  private currentStepId: string = '0'
  private steps: DynamicBreadCrumbsStep[] = []


  constructor() {
  }

  destroy() {
    // TODO: add
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

}
