import {ConsoleLogger} from 'squidlet-lib';
import {TelegramRenderer} from './telegramRenderer/TelegramRenderer.js';
import {UiFilesManager} from './ui/UiFilesManager.js';
import {TgBot} from './TgBot.js';
import {TgBotConfig} from './types/TgBotConfig.js';


export class Main {
  readonly config: TgBotConfig
  readonly tg: TgBot
  renderer: TelegramRenderer
  log: ConsoleLogger
  uiFilesManager: UiFilesManager = new UiFilesManager(this)


  constructor(config: TgBotConfig) {
    this.config = config
    this.tg = new TgBot(this)
    this.renderer = new TelegramRenderer(this)
    // TODO: use debug in debug mode
    this.log = new ConsoleLogger('error')
  }



}
