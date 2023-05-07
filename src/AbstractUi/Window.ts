import {IndexedEventEmitter} from 'squidlet-lib';
import {Router} from './Router.js';
import {UiState} from './UiState.js';


export enum WINDOW_EVENTS {

}

export interface WindowConfig {
  currentPath: string
  routes: Record<string, Screen>
}


/**
 * The singleton of whole UI
 */
export class Window {
  readonly events = new IndexedEventEmitter()
  readonly router = new Router()
  readonly state = new UiState()


  constructor(config: WindowConfig) {
  }

  async init() {

  }

  async destroy() {
    await this.router.destroy()
  }

}
