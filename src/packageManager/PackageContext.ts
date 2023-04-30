import {ConsoleLogger, IndexedEventEmitter} from 'squidlet-lib';
import App from '../App.js';
import ChannelLogger from '../helpers/ChannelLogger.js';
import {MenuChangeHandler} from './MenuRegister.js';


export class PackageContext {
  private readonly app


  get events(): IndexedEventEmitter {
    return this.app.events
  }

  get channelLog(): ChannelLogger {
    return this.app.channelLog
  }

  get consoleLog(): ConsoleLogger {
    return this.app.consoleLog
  }


  constructor(app: App) {
    this.app = app
  }


  onMenuChange(cb: MenuChangeHandler) {
    this.app.menu.onMenuChange(cb)
  }

}
