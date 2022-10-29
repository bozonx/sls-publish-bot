import TgMain from "./tgApi/TgMain";
import AppConfig from "./types/AppConfig";
import config from "./config";
import ru from "./I18n/ru";
import NotionApi from './notionApi/NotionApi';
import {mdBlocksToTelegram} from './helpers/mdBlocksToString';


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
      //this.config.utcOffset
    )
  }


  async init() {
    await this.tg.init();

    const aa = [
      { type: 'paragraph', parent: 'абзац1', children: [] },
      {
        type: 'paragraph',
        parent: 'строка1. (gggg) [bbbb]\nстрока2',
        children: []
      },
      { type: 'paragraph', parent: '', children: [] },
      {
        type: 'paragraph',
        parent: 'абзац с большим оступом',
        children: []
      },
      { type: 'bulleted_list_item', parent: '- эл1', children: [] },
      { type: 'bulleted_list_item', parent: '- вложенный', children: [] },
      { type: 'bulleted_list_item', parent: '- эл2', children: [] },
      { type: 'heading_2', parent: '## заголовок 2у', children: [] },
      {
        type: 'numbered_list_item',
        parent: '1. нумерованный',
        children: []
      },
      { type: 'numbered_list_item', parent: '2. список', children: [] },
      { type: 'heading_3', parent: '### Заголовок 3у', children: [] },
      {
        type: 'paragraph',
        parent: 'форматированный текст _наклонный_ **жирный** <u>подчёркнутый</u> ~~перечёркнутый~~ `код`',
        children: []
      },
      {
        type: 'paragraph',
        parent: '[ссылка](/2465ac4b72d54032927d5664bb2ee592)',
        children: []
      },
      { type: 'quote', parent: '> цитата  \n> стр2', children: [] },
      { type: 'paragraph', parent: 'ввв', children: [] },
      {
        type: 'code',
        parent: '```javascript\nбольшой код\n```',
        children: []
      },
      { type: 'paragraph', parent: 'маленькая палка', children: [] },
      { type: 'paragraph', parent: '—', children: [] },
      { type: 'paragraph', parent: 'большая палка', children: [] },
      { type: 'divider', parent: '---', children: [] },
      { type: 'paragraph', parent: 'пррр', children: [] }
    ]


    console.log(222, mdBlocksToTelegram(aa));

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
