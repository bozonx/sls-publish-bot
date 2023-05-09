import {UiContext} from './UiContext.js';
import {WindowConfig} from '../AbstractUi/interfaces/WindowConfig.js';
import {UiManager} from './UiManager.js';
import {Notify} from './Notify.js';
import {Window} from '../AbstractUi/Window.js';


export class UiMain {
  readonly uiManager: UiManager
  readonly window: Window

  private readonly uiContext: UiContext
  // TODO: use debug in debug mode
  // print all the messages exclude debug
  private readonly notify = new Notify(this, 'error')


  constructor(uiManager: UiManager) {
    this.uiManager = uiManager
    this.uiContext = new UiContext(this)

    const windowConfig: WindowConfig = {
      currentPath: '/',
      routes: this.uiManager.system.routes
    }

    this.window = new Window(windowConfig)
  }



  // TODO: add on UI init
  // TODO: add on UI destroy
}
