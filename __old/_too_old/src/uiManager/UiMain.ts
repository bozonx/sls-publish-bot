import {UiContext} from './UiContext';
import {WindowConfig} from '../../../squidlet-ui-builder/src/AbstractUi/interfaces/WindowConfig.js';
import {UiManager} from './UiManager';
import {Notify} from './Notify';
import {Window} from '../../../squidlet-ui-builder/src/AbstractUi/Window.js';


export class UiMain {
  readonly uiManager: UiManager
  readonly window: Window
  // TODO: use debug in debug mode
  // print all the messages exclude debug
  readonly notify = new Notify(this, 'error')

  private readonly uiContext: UiContext


  constructor(uiManager: UiManager) {
    this.uiManager = uiManager
    this.uiContext = new UiContext(this)

    const windowConfig: WindowConfig = {
      currentPath: '/',
      routes: this.uiManager.system.routes
    }

    this.window = new Window(windowConfig)
  }

  async destroy() {
    // TODO: add
  }


  // TODO: add on UI init
  // TODO: add on UI destroy
}
