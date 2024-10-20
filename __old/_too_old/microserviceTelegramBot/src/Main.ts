import {ConsoleLogger} from '../../../../../../../../mnt/disk2/workspace/squidlet-lib';
import {ChatsManager} from './tg/ChatsManager';
import {UiFilesManager} from './ui/UiFilesManager';
import {TgBotApi} from './tg/TgBotApi';
import {TgBotConfig} from './types/TgBotConfig';
import {ChatStorage} from './storage/ChatStorage';
import {BotStatusStorage} from './storage/BotStatusStorage';
import {UiFilesStorage} from './storage/UiFilesStorage';
import {SqliteDb} from './storage/SqliteDb';
import {DbStorage} from './types/DbStorage';
import {LONG_DB_NAME} from './types/constants';


export class Main {
  readonly config: TgBotConfig
  // TODO: connect logger microservice
  readonly log: ConsoleLogger
  readonly tgApi = new TgBotApi(this)
  // db with not often data changes
  readonly longDb: DbStorage = new SqliteDb(this)
  readonly chatsManager = new ChatsManager(this)
  readonly uiFilesManager: UiFilesManager = new UiFilesManager(this)
  readonly chatStorage = new ChatStorage(this)

  // TODO: save status - and remove it when bot removes
  readonly botStatusStorage = new BotStatusStorage(this)

  readonly uiFilesStorage = new UiFilesStorage(this)


  constructor(rawConfig: Partial<TgBotConfig>) {
    this.config = this.prepareConfig(rawConfig)

    this.log = new ConsoleLogger(this.config.logLevel)
  }


  async init() {
    try {
      this.log.info('Start instantiating')

      await this.longDb.init(LONG_DB_NAME)
      await this.chatsManager.init()

      this.log.info('Instantiated successfully')
    }
    catch(e) {
      this.log.error(`Instantiate error: ${e}`)
    }
  }

  async destroy(reason: string) {
    try {
      await this.chatsManager.destroy()
      await this.tgApi.destroy(reason)
      await this.longDb.destroy()
    }
    catch(e) {
      this.log.error(`Error while destroy: ${e}`)
    }
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
