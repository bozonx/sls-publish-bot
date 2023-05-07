import {ConsoleLogger} from 'squidlet-lib';
import AppConfig from './types/AppConfig.js';
import appConfig from './appConfig.js';
import ru from './I18n/ru.js';
import TasksMain from './taskManager/TasksMain.js';
import ChannelLogger from './helpers/ChannelLogger.js';
import {ApiWebServer} from './apiWebServer/ApiWebServer.js';
import {PackageManager} from './packageManager/PackageManager.js';
import {PackageIndex} from './types/types.js';
import {DynamicMenuMain} from './DynamicMenu/DynamicMenuMain.js';


export default class App {
  //public readonly events = new IndexedEventEmitter()
  public readonly appConfig: AppConfig = appConfig;
  public readonly menu: DynamicMenuMain = new DynamicMenuMain()
  //public readonly blogs: BlogsConfig;
  // public readonly tg: TgMain;
  // public readonly telegraPh: TelegraPhMain;
  // public readonly bloggerCom: BloggerComMain;
  // public readonly notion: NotionApi;
  public readonly webServer: ApiWebServer
  public readonly tasks: TasksMain;
  public readonly channelLog: ChannelLogger;
  public readonly consoleLog: ConsoleLogger;
  public readonly i18n = ru;

  private readonly packageManager: PackageManager


  constructor() {
    //this.blogs = this.makeExecConf(rawExecConfig);
    this.tasks = new TasksMain(this);
    this.webServer = new ApiWebServer(this)
    this.consoleLog = new ConsoleLogger(this.appConfig.consoleLogLevel);
    this.channelLog = new ChannelLogger(this.appConfig.channelLogLevel, this);
    this.packageManager = new PackageManager(this)
  }


  init() {
    (async () => {
      //await this.packageManager.init()
      await this.webServer.init()
      await this.tasks.init()
    })()
      .catch((e) => {
        this.consoleLog.error(e)

        // TODO: нормально задестроить

        process.exit(2)
      });
  }

  destroy(reason: string) {
    (async () => {
      await this.channelLog.info(`Bot is shutting down`);

      await this.menu.destroy()
      await this.tasks.destroy();
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

}
