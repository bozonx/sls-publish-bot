import TgMain from "./tgApi/TgMain";
import AppConfig from "./types/AppConfig";
import config from "./config";
import ru from "./I18n/ru";
import NotionApi from './notionApi/NotionApi';
import TasksMain from './taskManager/TasksMain';
import ChannelLogger from './helpers/ChannelLogger';
import ConsoleLogger from './helpers/ConsoleLogger';


//calcMsToDate('2022-10-30T10:00:00+03:00', 3);


export default class App {
  public readonly config: AppConfig;
  public readonly tg: TgMain;
  public readonly tasks: TasksMain;
  public channelLogger: ChannelLogger;
  public consoleLogger: ConsoleLogger;
  public readonly notion: NotionApi;
  public readonly i18n = ru;


  constructor() {
    this.config = this.makeConf();
    this.tg = new TgMain(this);
    this.tasks = new TasksMain(this);
    this.notion = new NotionApi(
      this.config.notionToken,
      //this.config.utcOffset
    )
  }


  async init() {
    await this.tg.init();




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


  private makeConf(): AppConfig {
    // TODO: check conf

    return config;
  }

}
