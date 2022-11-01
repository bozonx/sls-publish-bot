import TgMain from "./apiTg/TgMain";
import AppConfig from "./types/AppConfig";
import appConfig from "./appConfig";
import ru from "./I18n/ru";
import NotionApi from './apiNotion/NotionApi';
import TasksMain from './taskManager/TasksMain';
import ChannelLogger from './helpers/ChannelLogger';
import ConsoleLogger from './helpers/ConsoleLogger';
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
    this.notion = new NotionApi(this.config.notionToken)
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





    //console.log(222, mdBlocksToTelegram(aa));

    // console.log(1111, await this.tg.bot.telegram.getMe());
    // console.log(2222, await this.tg.bot.botInfo);
    // console.log(3333, await this.tg.bot.telegram.getMyDefaultAdministratorRights());
    // console.log(4444, await this.tg.bot.);
    // console.log(4444, await this.tg.bot.context.state);
    // console.log(5555, await this.tg.bot.context.channelPost);
    // console.log(6666, await this.tg.bot.context.myChatMember);
    // console.log(7777, await this.tg.bot.context.passportData);

    // TODO: remove
    // const data = await this.notionRequest.getPageContent('62f8e05281494b408b19ca6889f8268a');
    //
    // const sections = parseSections(data[0], data[1]);
    //
    // checkSection(sections);
    //
    // const info = makeSectionsInfo(sections);
    //
    // console.log(info)
    //
    // throw new Error(`3333`)
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
