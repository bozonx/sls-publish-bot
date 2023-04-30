import {ConsoleLogger} from 'squidlet-lib';
import App from '../App.js';
import ChannelLogger from '../helpers/ChannelLogger.js';
import {MenuItem} from '../types/MenuItem.js';


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


  registerMenuItem(pathToItem: string, menuItem: MenuItem) {
    this.app.menu.addMenuItem(pathToItem, menuItem)
  }

}
