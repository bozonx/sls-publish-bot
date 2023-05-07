import {ConsoleLogger} from 'squidlet-lib';
import App from '../App.js';
import ChannelLogger from '../helpers/ChannelLogger.js';
import {MenuChangeHandler} from '../../_useless/menuManager/MenuManager.js';
import ru from '../I18n/ru.js';
import TasksMain from '../taskManager/TasksMain.js';


export class PackageContext {
  private readonly app


  get channelLog(): ChannelLogger {
    return this.app.channelLog
  }

  get consoleLog(): ConsoleLogger {
    return this.app.consoleLog
  }

  get i18n(): typeof ru {
    return this.app.i18n
  }

  get tasks(): TasksMain {
    return this.app.tasks
  }


  constructor(app: App) {
    this.app = app
  }


  registerMenuChangeHandler(cb: MenuChangeHandler) {
    this.app.menu.onMenuChange(cb)
  }

}
