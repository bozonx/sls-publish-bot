import {IndexedEventEmitter} from 'squidlet-lib';
import {Router} from './Router.js';
import {UiState} from './UiState.js';
import {WindowConfig} from './interfaces/WindowConfig.js';


export enum WINDOW_EVENTS {

}


/**
 * The singleton of whole UI
 */
export class Window {
  readonly events = new IndexedEventEmitter()
  readonly router: Router
  readonly state = new UiState()

  private readonly initialConfig: WindowConfig


  constructor(config: WindowConfig) {
    this.initialConfig = config
    this.router = new Router(this, config.routes)
  }

  async init() {
    // TODO: set initial path
    await this.router.init()
  }

  async destroy() {
    await this.router.destroy()
  }

}
