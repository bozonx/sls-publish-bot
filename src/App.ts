import Tg from "./Tg";
import AppConfig from "./types/AppConfig";
import config from "./config";
import IndexedEventEmitter from "./lib/IndexedEventEmitter";
import NotionRequest from "./endpoints/NotionRequest";
import ru from "./I18n/ru";


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
    const data = await this.notionRequest.getPageContent('62f8e052-8149-4b40-8b19-ca6889f8268a');

  }


  private makeConf(): AppConfig {
    // TODO: check conf

    return config;
  }

}
