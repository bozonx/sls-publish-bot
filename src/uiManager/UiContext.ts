import {ConsoleLogger, AsyncLogger} from 'squidlet-lib';
import {Route} from '../AbstractUi/interfaces/Route.js';
import ru from '../I18n/ru.js';
import AppConfig from '../types/AppConfig.js';
import {UiMain} from './UiMain.js';


export class UiContext {
  private readonly uiMain: UiMain


  get routes(): Route[] {
    return this.uiMain.uiManager.system.routes
  }

  get config(): AppConfig {
    return this.uiMain.uiManager.system.appConfig
  }

  get log(): ConsoleLogger {
    return this.uiMain.uiManager.system.log
  }

  get i18n(): typeof ru {
    return this.uiMain.uiManager.system.i18n
  }

  get notify(): AsyncLogger {
    return this.uiMain.notify
  }


  constructor(uiMain: UiMain) {
    this.uiMain = uiMain
  }



}
