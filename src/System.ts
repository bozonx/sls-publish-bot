import {ConsoleLogger} from 'squidlet-lib';
import AppConfig from './types/AppConfig.js';
import appConfig from './appConfig.js';
import ru from './I18n/ru.js';
import {ApiWebServer} from './apiWebServer/ApiWebServer.js';
import {PackageManager} from './packageManager/PackageManager.js';
import {PackageIndex} from './types/types.js';
import {Window} from './AbstractUi/Window.js';
import {WindowConfig} from './AbstractUi/interfaces/WindowConfig.js';
import {Route} from './AbstractUi/interfaces/Route.js';


export default class System {
  //public readonly events = new IndexedEventEmitter()
  public readonly appConfig: AppConfig = appConfig;

  //public readonly blogs: BlogsConfig;
  // public readonly tg: TgMain;
  // public readonly telegraPh: TelegraPhMain;
  // public readonly bloggerCom: BloggerComMain;
  // public readonly notion: NotionApi;
  public readonly webServer: ApiWebServer
  //public readonly tasks: TasksMain;
  //public readonly channelLog: ChannelLogger;
  // it is system log - usually print to console or external logger
  public readonly log: ConsoleLogger;
  public readonly i18n = ru;

  private readonly packageManager: PackageManager
  private routes: Route[] = []
  private initQueue: {cb: () => Promise<void>, after?: string[]}[] = []


  constructor() {
    //this.blogs = this.makeExecConf(rawExecConfig);
    //this.tasks = new TasksMain(this);

    this.webServer = new ApiWebServer(this)
    this.log = new ConsoleLogger(this.appConfig.consoleLogLevel);
    //this.channelLog = new ChannelLogger(this.appConfig.channelLogLevel, this);
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
        this.consoleLog.error(e)

        // TODO: нормально задестроить

        process.exit(2)
      });
  }

  destroy(reason: string) {
    (async () => {
      //await this.channelLog.info(`Bot is shutting down`);

      //await this.tasks.destroy();
      await this.webServer.destroy()
      await this.packageManager.destroy()
    })()
      .catch((e) => {
        this.consoleLog.error(e);
      });
  }

  use(pkg: PackageIndex) {
    pkg(this.packageManager.ctx)
  }

  registerRoute(route: Route) {
    this.routes.push(route)
  }

  newWindow(): Window {
    const windowConfig: WindowConfig = {
      currentPath: '/',
      routes: this.routes
    }

    return new Window(windowConfig)
  }

  onInit(cb: () => Promise<void>, after?: string[]) {
    this.initQueue.push({
      cb,
      after
    })
  }

  onDestroy(cb: () => Promise<void>, before?: string[]) {
    // TODO: to do
  }

}
