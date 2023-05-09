import {ConsoleLogger} from 'squidlet-lib';
import {TelegramRenderer} from './telegramRenderer/TelegramRenderer.js';
import {UiFilesManager} from './ui/UiFilesManager.js';


export class Main {
  tg: TelegramRenderer
  log: ConsoleLogger
  uiFilesManager: UiFilesManager = new UiFilesManager(this)


  constructor() {
    this.tg = new TelegramRenderer(this)
    // TODO: use debug in debug mode
    this.log = new ConsoleLogger('error')
  }



}
