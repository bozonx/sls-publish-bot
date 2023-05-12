import {ConsoleLogger} from 'squidlet-lib';
import {ChatsManager} from './tg/ChatsManager.js';
import {UiFilesManager} from './ui/UiFilesManager.js';
import {TgBotApi} from './tg/TgBotApi.js';
import {TgBotConfig} from './types/TgBotConfig.js';
import {ChatStorage} from './storage/ChatStorage.js';
import {BotStatusStorage} from './storage/BotStatusStorage.js';
import {UiFilesStorage} from './storage/UiFilesStorage.js';
import {SqliteDb} from './storage/SqliteDb.js';
import {DbStorage} from './types/DbStorage.js';


export class Main {
  readonly config: TgBotConfig
  // TODO: connect logger microservice
  readonly log: ConsoleLogger
  readonly tgApi = new TgBotApi(this)
  readonly db: DbStorage = new SqliteDb(this)
  readonly chatsManager = new ChatsManager(this)
  readonly uiFilesManager: UiFilesManager = new UiFilesManager(this)
  readonly chatStorage = new ChatStorage(this)
  readonly botStatusStorage = new BotStatusStorage(this)
  readonly uiFilesStorage = new UiFilesStorage(this)


  constructor(rawConfig: Partial<TgBotConfig>) {
    this.config = this.prepareConfig(rawConfig)

    this.log = new ConsoleLogger(this.config.logLevel)
  }


  init() {
    (async () => {
      this.log.info('Start instantiating')

      await this.db.init()
      await this.chatsManager.init()

      this.log.info('Instantiated successfully')
    })()
      .catch((e) => this.log.error(`Instantiate error: ${e}`))
  }

  destroy(reason: string) {
    (async () => {
      await this.chatsManager.destroy()
      await this.tgApi.destroy(reason)
      await this.db.destroy()
    })()
      .catch((e) => this.log.error(`Error while destroy: ${e}`))
  }


  private prepareConfig(rawConfig: Partial<TgBotConfig>): TgBotConfig {
    if (!rawConfig.longStoragePath) throw new Error(`longStoragePath has to be set`)
    if (!rawConfig.varStoragePath) throw new Error(`varStoragePath has to be set`)

    return {
      isProduction: process.env.NODE_ENV === 'production',
      debug: Boolean(rawConfig.debug),
      // in debug log all the debug message
      // in normal mode - use log level which is set in config
      logLevel: (rawConfig.debug) ? 'debug' : rawConfig.logLevel || 'info',
      longStoragePath: rawConfig.longStoragePath,
      varStoragePath: rawConfig.varStoragePath,
      db: 'sqlite'
    }
  }

}
