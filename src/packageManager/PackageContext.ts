import {ConsoleLogger} from 'squidlet-lib';
import System from '../System.js';
import ru from '../I18n/ru.js';
import {Window} from '../AbstractUi/Window.js';
import AppConfig from '../types/AppConfig.js';
import {Route} from '../AbstractUi/interfaces/Route.js';


export class PackageContext {
  private readonly system


  // TODO: поидее не особо нужно
  get config(): AppConfig {
    return this.system.appConfig
  }

  get log(): ConsoleLogger {
    return this.system.log
  }

  get i18n(): typeof ru {
    return this.system.i18n
  }

  // get tasks(): TasksMain {
  //   return this.app.tasks
  // }


  constructor(system: System) {
    this.system = system
  }


  newUi(): Window {
    return this.system.newUi()
  }

  registerRoute(route: Route) {
    this.system.registerRoute(route)
  }

  onSystemInit(cb: () => Promise<void>, after?: string[]) {
    this.system.onSystemInit(cb, after)
  }

  onSystemDestroy(cb: () => Promise<void>, before?: string[]) {
    this.system.onSystemDestroy(cb, before)
  }

  onUiInit(cb: () => Promise<void>, after?: string[]) {
    this.system.uiManager.onUiInit(cb, after)
  }

  onUiDestroy(cb: () => Promise<void>, before?: string[]) {
    this.system.uiManager.onUiDestroy(cb, before)
  }

}
