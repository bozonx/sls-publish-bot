import {ConsoleLogger} from 'squidlet-lib';
import AppConfig from './types/AppConfig.js';
import appConfig from './appConfig.js';
import ru from './I18n/ru.js';
import {ApiWebServer} from './apiWebServer/ApiWebServer.js';
import {PackageManager} from './packageManager/PackageManager.js';
import {PackageIndex} from './types/types.js';
import {Route} from './AbstractUi/interfaces/Route.js';
import {UiManager} from './uiManager/UiManager.js';


export default class System {
  //public readonly events = new IndexedEventEmitter()
  readonly appConfig: AppConfig = appConfig;

  readonly webServer: ApiWebServer
  //public readonly tasks: TasksMain;
  // it is system log - usually print to console or external logger
  readonly log: ConsoleLogger;
  readonly i18n = ru;
  readonly uiManager = new UiManager(this)
  // to collect routes from packages after start and before init
  routes: Route[] = []

  private readonly packageManager: PackageManager

  // TODO: сделать это через отдельный класс, который будет сортировать ф-и инициализации
  // the queue of packages to init
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []
  // the queue of packages to destroy
  private destroyQueue: {cb: () => Promise<void>, before?: string[]}[] = []


  constructor() {
    //this.tasks = new TasksMain(this);

    this.webServer = new ApiWebServer(this)
    this.log = new ConsoleLogger(this.appConfig.consoleLogLevel);
    this.packageManager = new PackageManager(this)
  }


  init() {
    (async () => {
      //await this.packageManager.init()
      await this.webServer.init()
      //await this.tasks.init()

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
      //await this.channelLog.info(`Bot is shutting down`);

      //await this.tasks.destroy();
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

  registerRoute(route: Route) {
    this.routes.push(route)
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
