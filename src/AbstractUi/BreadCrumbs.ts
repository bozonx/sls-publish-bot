import {IndexedEvents} from 'squidlet-lib'
import {UiState} from './UiState.js';


export const BREADCRUMBS_DELIMITER = '/'


export interface BreadCrumbsStep {
  // Name of the step. It is part of path
  name: string
  // local state of path
  state: UiState
  // it is set from router
  params: Record<string, any>
}

export default class BreadCrumbs {
  pathChangeEvent: IndexedEvents<() => void> = new IndexedEvents()
  private currentStepId: string = '0'
  private steps: BreadCrumbsStep[] = []


  constructor() {
  }

  destroy() {
    // TODO: add
    // TODO: destroy states
  }


  getCurrentStepId(): string {
    return this.currentStepId
  }

  getCurrentStep(): BreadCrumbsStep {
    return this.steps[Number(this.currentStepId)]
  }

  getCurrentPath(): string {
    return this.getPathOfStepId(this.currentStepId)
  }

  getPathOfStepId(stepId: string): string {

    // TODO: почему не используется stepId ???

    const names: string[] = this.steps.map((el) => el.name)
    // TODO: проверить
    const sliced: string[] = names.splice(0, Number(this.currentStepId) + 1)

    return sliced.join(BREADCRUMBS_DELIMITER)
  }

  /**
   * Add step to current path
   * @param name
   * @param initialState
   * @param params
   */
  addStep(name: string, initialState: Record<any, any> = {}, params: Record<any, any> = {}): string {
    const stepId = String(this.steps.length)

    this.steps.push({
      name,
      state: new UiState(initialState),
      params,
    })

    this.currentStepId = stepId

    this.pathChangeEvent.emit()

    return this.currentStepId
  }

  toPath(newPath: string, params: Record<string, any>): string {

    // TODO: если будет или не будет начальный слэш???

    const pathNames: string[] = newPath.split(BREADCRUMBS_DELIMITER)
    const newPathId = String(pathNames.length - 1)

    if (this.pathBaseOfCurrentPath(newPath)) {
      this.toStep(newPathId, params)

      return this.currentStepId
    }
    // TODO: если это часть текущего пути то просто срезать путь

    this.steps = []

    // TODO: что будет в случае рута???

    for (const name of pathNames) {
      this.steps.push({
        name,
        state: new UiState(),
        params,
      })
    }

    this.currentStepId = newPathId

    this.pathChangeEvent.emit()

    return this.currentStepId
  }

  toStep(stepId: string, params: Record<string, any>) {
    const newStepIdNum = Number(stepId)
    // if new step is greater or equal with current - do nothing
    if (newStepIdNum >= Number(this.currentStepId)) return this.currentStepId

    // TODO: обновить params

    this.currentStepId = stepId

    // TODO: check
    // remove tail
    this.steps.splice(newStepIdNum)
  }

  back() {
    // TODO: do not remove bread crumbs just chanes id
  }

  forward() {
    // TODO: return to breadcrumb and it's saved state
  }


  private pathBaseOfCurrentPath(newPath: string): boolean {
    const currentPath = this.steps
      .map((el) => el.name)
      .join(BREADCRUMBS_DELIMITER)

    return currentPath.indexOf(newPath) >= 0
  }

}
