import {AsyncLogger} from 'squidlet-lib';
import {UiManager} from './UiManager.js';


// TODO: add


export class NotifyAll implements AsyncLogger {
  private readonly uiManager: UiManager;



  constructor(uiManager: UiManager) {
    this.uiManager = uiManager;
  }


  log = async (message: string) => {

  }

  debug = async (message: string) => {

  }

  info = async (message: string) => {

  }

  warn = async (message: string) => {

  }

  error = async (message: string | Error) => {

  }
}
