import BreadCrumbs from './BreadCrumbs.js';
import {Window} from './Window.js';
import {Route} from './interfaces/Route.js';


export class Router {
  private window: Window
  private breadCrumbs = new BreadCrumbs()
  private routes: Route[] = []


  constructor(window: Window, routes: Route[]) {
    this.window = window
    this.routes = routes
  }

  init() {

  }

  async destroy() {
    this.routes = []

    this.breadCrumbs.destroy()
  }


  async toPath(pathTo: string) {
    const route = this.resolveRouteByPath(pathTo)

    if (!route) {
      // TODO: to screen 404
    }

    // TODO: при извлечении параметров очистить путь
    const clearPath = pathTo
    // TODO: можно извлечь параметры из пути и передать их в breadcrumbs
    const pathParams = {}

    this.breadCrumbs.toPath(pathTo, pathParams)

    // TODO: нужно найти соответствующий путь
    // TODO: нужно закрыть предыдущий экран - выполнить у него destroy
    // TODO: инициализировать новый экран
  }


  private resolveRouteByPath(pathTo: string): Route | undefined {
    return this.routes.find((el) => {

      // TODO: make more smart comparison

      if (el.path === pathTo) return true
    })
  }

}
