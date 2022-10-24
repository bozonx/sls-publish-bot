import Tg from "./Tg";
import AppConfig from "./types/AppConfig";
import config from "./config";
import IndexedEventEmitter from "./lib/IndexedEventEmitter";
import NotionRequest from "./endpoints/NotionRequest";
import ru from "./I18n/ru";
import {checkSection, makeSectionsInfo, parseSections} from './lib/parseMdBlocks';


export default class App {
  public readonly config: AppConfig;
  public readonly events: IndexedEventEmitter;
  public readonly tg: Tg;
  public readonly notionRequest: NotionRequest;
  public readonly i18n = ru;


  constructor() {
    this.config = this.makeConf();
    this.events = new IndexedEventEmitter();
    this.tg = new Tg(this);
    this.notionRequest = new NotionRequest(this);
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
