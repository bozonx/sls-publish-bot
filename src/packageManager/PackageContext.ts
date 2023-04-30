import {IndexedEventEmitter} from 'squidlet-lib'
import App from '../App.js';
import ConsoleLogger from '../lib/ConsoleLogger.js';
import ChannelLogger from '../helpers/ChannelLogger.js';


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


  registerMenuItem() {
    // TODO: зарегистрировать элемент меню
  }
}
