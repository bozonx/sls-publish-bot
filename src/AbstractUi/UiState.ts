import {IndexedEvents} from 'squidlet-lib';


export class UiState {
  changeEvent = new IndexedEvents()

  state: Record<string, any> = {}


  constructor(initialState: Record<string, any> = {}) {

  }

  destroy() {
    this.changeEvent.destroy()
  }


  getValue() {

  }

  setValue() {

  }

}