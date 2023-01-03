import TgMain from './apiTg/TgMain.js';
import AppConfig from './types/AppConfig.js';
import appConfig from './appConfig.js';
import ru from './I18n/ru.js';
import NotionApi from './apiNotion/NotionApi.js';
import TasksMain from './taskManager/TasksMain.js';
import ChannelLogger from './helpers/ChannelLogger.js';
import ConsoleLogger from './lib/ConsoleLogger.js';
import TelegraPhMain from './apiTelegraPh/telegraPhMain.js';
import BlogsConfig from './types/BlogsConfig.js';


export default class App {
  public readonly appConfig: AppConfig = appConfig;
  public readonly blogs: BlogsConfig;
  public readonly tg: TgMain;
  public readonly telegraPh: TelegraPhMain;
  public readonly tasks: TasksMain;
  public readonly channelLog: ChannelLogger;
  public readonly consoleLog: ConsoleLogger;
  public readonly notion: NotionApi;
  public readonly i18n = ru;


  constructor(rawExecConfig: BlogsConfig) {
    this.blogs = this.makeExecConf(rawExecConfig);
    this.tg = new TgMain(this);
    this.tasks = new TasksMain(this);
    this.telegraPh = new TelegraPhMain(this);
    this.consoleLog = new ConsoleLogger(this.appConfig.consoleLogLevel);
    this.channelLog = new ChannelLogger(this.appConfig.channelLogLevel, this);
    this.notion = new NotionApi(this.appConfig.notionToken)
  }


  init() {
    (async () => {
      await this.tg.init();
      await this.telegraPh.init();
      await this.tasks.init();
    })()
      .catch((e) => {
        this.consoleLog.error(e);

        // TODO: нормально задестроить

        process.exit(2);
      });
  }

  destroy(reason: string) {
    (async () => {
      await this.channelLog.info(`Bot is shutting down`);

      await this.tasks.destroy();
      await this.tg.destroy(reason);
    })()
      .catch((e) => {
        this.consoleLog.error(e);
      });
  }


  private makeExecConf(rawBlogsConfig: BlogsConfig): BlogsConfig {
    // TODO: check conf

    return rawBlogsConfig;
  }

}
