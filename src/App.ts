import TgMain from "./tgApi/TgMain";
import AppConfig from "./types/AppConfig";
import config from "./config";
import ru from "./I18n/ru";
import NotionApi from './notionApi/NotionApi';


export default class App {
  public readonly config: AppConfig;
  public readonly tg: TgMain;
  public readonly notion: NotionApi;
  public readonly i18n = ru;


  constructor() {
    this.config = this.makeConf();
    this.tg = new TgMain(this);
    //this.notionRequest = new NotionRequest(this);
    this.notion = new NotionApi(
      this.config.notionToken,
      this.config.utcOffset
    )
  }


  async init() {
    await this.tg.init();

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
