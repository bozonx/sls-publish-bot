import TelegramRenderer from './telegramRenderer/index.js';


export class Main {
  tg: TelegramRenderer


  constructor() {
    this.tg = new TelegramRenderer(this)
  }



}