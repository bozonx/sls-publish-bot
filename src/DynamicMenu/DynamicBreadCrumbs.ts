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


  getCurrentStepId(): string {
    return this.currentStepId
  }

  getCurrentStep(): DynamicBreadCrumbsStep {
    return this.steps[Number(this.currentStepId)]
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
    const pathNames: string[] = newPath.split(BREADCRUMBS_DELIMITER)
    const newPathId = String(pathNames.length - 1)

    if (this.pathBaseOfCurrentPath(newPath)) {
      this.toStep(newPathId)

      return this.currentStepId
    }
    // TODO: если это часть текущего пути то просто срезать путь

    this.steps = []

    // TODO: что будет в случае рута???

    for (const name of pathNames) {
      this.steps.push({
        name,
        state: {},
      })
    }

    this.currentStepId = newPathId

    this.pathChangeEvent.emit()

    return this.currentStepId
  }

  toStep(stepId: string): string {
    // if index less than specified
    //if (this.steps.length -1 < stepIndex) return

    //this.steps.splice(stepIndex)
  }

  back() {
    // TODO: do not remove bread crumbs just chanes id
  }

  forward() {
    // return to breadcrumb and it's saved state
  }


  private pathBaseOfCurrentPath(newPath: string): boolean {
    const currentPath = this.steps
      .map((el) => el.name)
      .join(BREADCRUMBS_DELIMITER)

    return currentPath.indexOf(newPath) >= 0
  }

}
