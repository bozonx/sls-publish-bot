import {ConsoleLogger} from 'squidlet-lib';
import System from '../System.js';
import {MenuChangeHandler} from '../../_useless/menuManager/MenuManager.js';
import ru from '../I18n/ru.js';
import {DynamicMenuMain} from '../DynamicMenu/DynamicMenuMain.js';


export class PackageContext {
  private readonly system


  // get channelLog(): ChannelLogger {
  //   return this.app.channelLog
  // }

  get menu(): DynamicMenuMain {
    return this.system.menu
  }

  get consoleLog(): ConsoleLogger {
    return this.system.consoleLog
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


}
