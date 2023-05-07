import BreadCrumbs, {BREADCRUMBS_DELIMITER} from './BreadCrumbs.js';
import {Window} from './Window.js';
import {Route} from './interfaces/Route.js';
import {Screen} from './Screen.js';


export class Router {
  breadCrumbs = new BreadCrumbs()

  private window: Window
  private routes: Route[] = []
  private currentScreenInstance!: Screen
  private currentRoute!: Route


  get screen(): Screen {
    return this.currentScreenInstance
  }

  get route(): Route {
    return this.currentRoute
  }

  constructor(window: Window, routes: Route[]) {
    this.window = window
    this.routes = routes
  }

  async init(initialPath: string = BREADCRUMBS_DELIMITER) {
    this.breadCrumbs.pathChangeEvent.addListener(this.onPathChanged)
    await this.toPath(initialPath)
  }

  async destroy() {
    this.routes = []

    this.breadCrumbs.destroy()
  }


  async toPath(pathTo: string) {
    const route = this.resolveRouteByPath(pathTo)

    if (!route) {
      // TODO: to screen 404

      return
    }

    this.currentRoute = route

    // TODO: при извлечении параметров очистить путь
    const clearPath = pathTo
    // TODO: можно извлечь параметры из пути и передать их в breadcrumbs
    const pathParams = {}

    this.breadCrumbs.toPath(pathTo, pathParams)
  }


  private onPathChanged = () => {
    (async () => {
      if (this.currentScreenInstance) {
        await this.currentScreenInstance.destroy()
      }

      if (!this.currentRoute) {
        throw new Error(`No route`)
      }

      // TODO: что ещё ему передать??
      this.currentScreenInstance = new Screen(this.window)

      await this.currentScreenInstance.init()
    })()
      .catch((e) => {
        throw e

        // TODO: что делать с ошибкой??
      })
  }

  private resolveRouteByPath(pathTo: string): Route | undefined {
    return this.routes.find((el) => {

      // TODO: make more smart comparison

      if (el.path === pathTo) return true
    })
  }

}
