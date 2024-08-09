import {ConsoleLogger} from 'squidlet-lib';
import System from '../System';
import ru from '../I18n/ru';
import AppConfig from '../types/AppConfig';
import {Route} from '../../../squidlet-ui-builder/src/AbstractUi/interfaces/Route.js';
import {UiMain} from '../uiManager/UiMain';
import TasksMain from '../taskManager/TasksMain';


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

  get tasks(): TasksMain {
    return this.system.tasks
  }


  constructor(system: System) {
    this.system = system
  }


  newUi(): UiMain {
    return this.system.uiManager.newUi()
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
