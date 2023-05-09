import {AsyncLogger} from 'squidlet-lib';
import {UiContext} from './UiContext.js';
import {WindowConfig} from '../AbstractUi/interfaces/WindowConfig.js';
import {UiManager} from './UiManager.js';


export class UiMain {
  readonly uiManager: UiManager

  private readonly uiContext: UiContext

  //public readonly channelLog: ChannelLogger;


  constructor(uiManager: UiManager) {
    this.uiManager = uiManager
    this.uiContext = new UiContext(this)


    // TODO: add
    const windowConfig: WindowConfig = {
      currentPath: '/',
      routes: this.uiContext.routes
    }

  }


  get notify(): AsyncLogger {
    //return this.system.no
  }


  // TODO: add on UI init
  // TODO: add on UI destroy
}
