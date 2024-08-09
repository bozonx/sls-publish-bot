import {ConsoleLogger} from 'squidlet-lib';
import AppConfig from './types/AppConfig';
import appConfig from './appConfig';
import ru from './I18n/ru';
import {ApiWebServer} from './apiWebServer/ApiWebServer';
import {PackageManager} from './packageManager/PackageManager';
import {PackageIndex} from './types/types';
import {UserManager} from './userManager/UserManager';


export default class System {
  //public readonly events = new IndexedEventEmitter()
  readonly appConfig: AppConfig = appConfig;
  readonly webServer = new ApiWebServer(this)
  // it is system log - usually print to console or external logger
  readonly log: ConsoleLogger;
  readonly i18n = ru
  readonly userManager = new UserManager(this)

  private readonly packageManager = new PackageManager(this)

  // TODO: сделать это через отдельный класс, который будет сортировать ф-и инициализации
  // the queue of packages to init
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []
  // the queue of packages to destroy
  private destroyQueue: {cb: () => Promise<void>, before?: string[]}[] = []


  constructor() {
    this.log = new ConsoleLogger(this.appConfig.consoleLogLevel)
  }


  init() {
    (async () => {
      await this.webServer.init()
      await this.userManager.init()

      for (const item of this.initQueue) {
        // TODO: handle error
        await item.cb()
        // TODO: use after
      }
    })()
      .catch((e) => {
        this.log.error(e)

        // TODO: нормально задестроить

        process.exit(2)
      });
  }

  destroy(reason: string) {
    (async () => {
      for (const item of this.destroyQueue) {
        // TODO: handle error
        await item.cb()
        // TODO: use bedore
      }

      await this.userManager.destroy()
      await this.webServer.destroy()
      await this.packageManager.destroy()
    })()
      .catch((e) => {
        this.log.error(e);
      });
  }

  use(pkg: PackageIndex) {
    pkg(this.packageManager.ctx)
  }

  onSystemInit(cb: () => Promise<void>, after?: string[]) {
    this.initQueue.push({
      cb,
      after
    })
  }

  onSystemDestroy(cb: () => Promise<void>, before?: string[]) {
    this.destroyQueue.push({
      cb,
      before
    })
  }

}
