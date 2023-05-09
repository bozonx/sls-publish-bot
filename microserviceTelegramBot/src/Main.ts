import {ConsoleLogger} from 'squidlet-lib';
import {TelegramRenderer} from './telegramRenderer/TelegramRenderer.js';
import {UiFilesManager} from './ui/UiFilesManager.js';
import {TgBot} from './TgBot.js';
import {TgBotConfig} from './types/TgBotConfig.js';


export class Main {
  readonly config: TgBotConfig
  readonly tg: TgBot
  readonly renderer: TelegramRenderer
  readonly log: ConsoleLogger
  readonly uiFilesManager: UiFilesManager = new UiFilesManager(this)


  constructor(config: TgBotConfig) {
    this.config = config
    this.tg = new TgBot(this)
    this.renderer = new TelegramRenderer(this)
    // TODO: use debug in debug mode
    this.log = new ConsoleLogger('error')
  }


  async init() {
    await this.tg.init()
    await this.renderer.init()
  }

  async destroy() {
    await this.renderer.destroy()
    await this.tg.destroy('App stops')
  }

}
