import {TelegramRenderer} from './telegramRenderer/TelegramRenderer.js';


export class Main {
  tg: TelegramRenderer


  constructor() {
    this.tg = new TelegramRenderer(this)
  }



}
