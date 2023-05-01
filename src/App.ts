import {ConsoleLogger, IndexedEventEmitter} from 'squidlet-lib';
import TgMain from './apiTg/TgMain.js';
import AppConfig from './types/AppConfig.js';
import appConfig from './appConfig.js';
import ru from './I18n/ru.js';
import NotionApi from './apiNotion/NotionApi.js';
import TasksMain from './taskManager/TasksMain.js';
import ChannelLogger from './helpers/ChannelLogger.js';
import TelegraPhMain from './apiTelegraPh/telegraPhMain.js';
import BlogsConfig from './types/BlogsConfig.js';
import BloggerComMain from './apiBloggerCom/BloggerComMain.js';
import {ApiWebServer} from './apiWebServer/ApiWebServer.js';
import {PackageManager} from './packageManager/PackageManager.js';
import {PackageIndex} from './types/types.js';
import {MenuManager} from './menuManager/MenuManager.js';
import {TelegramMenuRenderer} from './apiTg/TelegramMenuRenderer.js';


export default class App {
  //public readonly events = new IndexedEventEmitter()
  public readonly appConfig: AppConfig = appConfig;
  public readonly menu: MenuManager
  public readonly blogs: BlogsConfig;
  public readonly tg: TgMain;
  public readonly telegraPh: TelegraPhMain;
  public readonly bloggerCom: BloggerComMain;
  public readonly webServer: ApiWebServer
  public readonly tasks: TasksMain;
  public readonly channelLog: ChannelLogger;
  public readonly consoleLog: ConsoleLogger;
  public readonly notion: NotionApi;
  public readonly i18n = ru;

  private readonly packageManager: PackageManager


  constructor(rawExecConfig: BlogsConfig) {
    this.menu = new MenuManager()
    this.blogs = this.makeExecConf(rawExecConfig);
    this.tg = new TgMain(this);
    this.tasks = new TasksMain(this);
    this.telegraPh = new TelegraPhMain(this);
    this.bloggerCom = new BloggerComMain(this.appConfig.googleApiToken)
    this.webServer = new ApiWebServer(this)
    this.consoleLog = new ConsoleLogger(this.appConfig.consoleLogLevel);
    this.channelLog = new ChannelLogger(this.appConfig.channelLogLevel, this);
    this.notion = new NotionApi(this.appConfig.notionToken)
    this.packageManager = new PackageManager(this)
  }


  init() {
    (async () => {
      //await this.packageManager.init()
      await this.tg.init()
      await this.telegraPh.init()
      await this.bloggerCom.init()
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

      await this.tasks.destroy();
      await this.webServer.destroy()
      await this.tg.destroy(reason);
      await this.packageManager.destroy()
    })()
      .catch((e) => {
        this.consoleLog.error(e);
      });
  }

  use(pkg: PackageIndex) {
    pkg(this.packageManager.ctx)
  }


  private makeExecConf(rawBlogsConfig: BlogsConfig): BlogsConfig {
    // TODO: check conf

    return rawBlogsConfig;
  }

}
