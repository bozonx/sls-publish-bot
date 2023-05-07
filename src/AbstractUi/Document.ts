import {IndexedEvents} from 'squidlet-lib'
import {AnyElement} from './interfaces/AnyElement.js';


export type DocumentEventHandler = (elementPath: string, eventName: string, data: any) => void


export class Document {
  readonly events = new IndexedEvents<DocumentEventHandler>()
  readonly elements: AnyElement[] = []


  async destroy() {
    // TODO: destroy all the elements
  }


  on(elementPath: string, eventName: string, handler: (data: any) => void) {
    return this.events.addListener((incomeElementPath: string, incomeEventName: string, data: any) => {
      if (elementPath !== incomeElementPath && eventName !== incomeEventName) return

      handler(data)
    })
  }

  incomeEvent(elementPath: string, eventName: string, data: any) {
    this.events.emit(elementPath, eventName, data)
  }

}
