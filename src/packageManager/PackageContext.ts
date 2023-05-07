import {ConsoleLogger} from 'squidlet-lib';
import System from '../System.js';
import ru from '../I18n/ru.js';
import {Window} from '../AbstractUi/Window.js';


export class PackageContext {
  private readonly system


  // get channelLog(): ChannelLogger {
  //   return this.app.channelLog
  // }

  get window(): Window {
    return this.system.window
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
