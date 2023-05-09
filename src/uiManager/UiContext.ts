import {UiManager} from './UiManager.js';

export class UiContext {
  private uiManager: UiManager


  constructor(uiManager: UiManager) {
    this.uiManager = uiManager
  }

}