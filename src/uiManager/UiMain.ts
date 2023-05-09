import {Logger} from 'squidlet-lib';
import {UiContext} from './UiContext.js';
import {WindowConfig} from '../AbstractUi/interfaces/WindowConfig.js';


export class UiMain {
  private readonly uiContext: UiContext

  //public readonly channelLog: ChannelLogger;

  //this.channelLog = new ChannelLogger(this.appConfig.channelLogLevel, this);

  // get channelLog(): ChannelLogger {
  //   return this.app.channelLog
  // }

  constructor(uiContent: UiContext) {
    this.uiContext = uiContent


    // TODO: add
    const windowConfig: WindowConfig = {
      currentPath: '/',
      routes: this.routes
    }

  }


  // get notify(): Logger {
  //   //return this.system.no
  // }


  // TODO: add on UI init
  // TODO: add on UI destroy
}
