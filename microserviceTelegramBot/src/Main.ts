import {ConsoleLogger} from 'squidlet-lib';
import {TelegramRenderer} from './telegramRenderer/TelegramRenderer.js';
import {UiFilesManager} from './ui/UiFilesManager.js';
import {TgBot} from './TgBot.js';
import {TgBotConfig} from './types/TgBotConfig.js';

// TODO: !

/*
ему присылают уже сгенерированный фонфиг меню, который он будет показывать
  поьзователю. И будет обрабатывать ответы указанным образом

  получается что это будет abstractUi файлы, с которым будет работать бот.
  Но они уже будут подготовленны - убранно лишее и не будут формироваться из
  пакетов, а сразу готовы. Если что-то изменится, будет установлен новый пакет пользователем
  то эти файлы обновятся
 */


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


  init() {
    (async () => {
      await this.tg.init()
      await this.renderer.init()
    })()
      .catch((e) => this.log.error(e))
  }

  async destroy() {
    await this.renderer.destroy()
    await this.tg.destroy('App stops')
  }

}
