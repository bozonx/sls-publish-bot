import TgMain from "./apiTg/TgMain";
import AppConfig from "./types/AppConfig";
import appConfig from "./appConfig";
import ru from "./I18n/ru";
import NotionApi from './apiNotion/NotionApi';
import TasksMain from './taskManager/TasksMain';
import ChannelLogger from './helpers/ChannelLogger';
import ConsoleLogger from './lib/ConsoleLogger';
import TelegraPhMain from './apiTelegraPh/telegraPhMain';
import ExecConfig from './types/ExecConfig';


export default class App {
  public readonly appConfig: AppConfig = appConfig;
  public readonly config: ExecConfig;
  public readonly tg: TgMain;
  public readonly telegraPh: TelegraPhMain;
  public readonly tasks: TasksMain;
  public readonly channelLog: ChannelLogger;
  public readonly consoleLog: ConsoleLogger;
  public readonly notion: NotionApi;
  public readonly i18n = ru;


  constructor(rawExecConfig: ExecConfig) {
    this.config = this.makeExecConf(rawExecConfig);
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

      // const res = await this.notion.api.databases.retrieve({ database_id : this.config.blogs.test.notionSellTgDbId })
      // console.log(1111, (res as any))
      // console.log(2222, (res.properties as any))
      // console.log(2222, (res.properties.format as any).select)
      // console.log(2222, (res.properties.type as any).select)

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


  private makeExecConf(rawExecConfig: ExecConfig): ExecConfig {
    // TODO: check conf

    return rawExecConfig;
  }

}
