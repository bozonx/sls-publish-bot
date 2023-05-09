import {AsyncLogger} from 'squidlet-lib';
import {UiContext} from './UiContext.js';
import {WindowConfig} from '../AbstractUi/interfaces/WindowConfig.js';
import {UiManager} from './UiManager.js';
import Notify from './Notify.js';


export class UiMain {
  readonly uiManager: UiManager

  private readonly uiContext: UiContext
  // TODO: use debug in debug mode
  // print all the messages exclude debug
  private readonly notify = new Notify(this, 'error')

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



  // TODO: add on UI init
  // TODO: add on UI destroy
}
