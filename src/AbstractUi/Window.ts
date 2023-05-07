import {IndexedEventEmitter} from 'squidlet-lib';
import {Document} from './Document.js';
import {Router} from './Router.js';
import {UiState} from './UiState.js';
import {WindowConfig} from './interfaces/WindowConfig.js';
import {AnyElement} from './interfaces/AnyElement.js';
import {UI_EVENTS} from './interfaces/UiEvents.js';


export enum WINDOW_EVENTS {
  attached,
  detached,
  // risen after applying all the changes
  changed,
}


/**
 * The singleton of whole UI
 */
export class Window {
  readonly events = new IndexedEventEmitter()
  readonly router: Router
  readonly state = new UiState()
  readonly rootDocument = new Document()


  private readonly initialConfig: WindowConfig


  constructor(config: WindowConfig) {
    this.initialConfig = config
    this.router = new Router(this, config.routes)
  }

  async init() {
    await this.router.init(this.initialConfig.currentPath)
  }

  async destroy() {
    this.events.destroy()
    this.state.destroy()
    await this.router.destroy()
    await this.rootDocument.destroy()
  }


  onAttached(handler: (elementPath: string, element: AnyElement) => void): number {
    return this.events.addListener(WINDOW_EVENTS.attached, handler)
  }

  onDetached(handler: (elementPath: string, element: AnyElement) => void): number {
    return this.events.addListener(WINDOW_EVENTS.detached, handler)
  }

  onDomChanged(handler: () => void): number {
    return this.events.addListener(WINDOW_EVENTS.changed, handler)
  }

  handleUiEvent(eventName: UI_EVENTS, ...data: any[]) {
    // TODO: put data to the element

    console.log('income event', eventName, data)
  }

}
