import {ConsoleLogger, IndexedEventEmitter} from 'squidlet-lib';
import App from '../App.js';
import ChannelLogger from '../helpers/ChannelLogger.js';
import {MenuChangeHandler} from '../menuManager/MenuManager.js';


export class PackageContext {
  private readonly app


  get channelLog(): ChannelLogger {
    return this.app.channelLog
  }

  get consoleLog(): ConsoleLogger {
    return this.app.consoleLog
  }


  constructor(app: App) {
    this.app = app
  }


  registerMenuChangeHandler(cb: MenuChangeHandler) {
    // TODO: register html menu too
    this.app.menu.onMenuChange(cb)
  }

}
