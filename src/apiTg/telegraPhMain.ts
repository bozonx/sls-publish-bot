/*
 * Взято из https://github.com/husky-dev/telegraph-cli
 */
import {getApi} from '../apiTelegraPh/api';
import App from '../App';
import {transformNotionToTelegraph} from '../helpers/transformNotionToTelegraph';


export default class TelegraPhMain {
  private readonly app: App;
  private readonly api;


  constructor(app: App) {
    this.app = app;
    this.api = getApi({ token: this.app.config.telegraPhToken });


  }

  async init() {

    transformNotionToTelegraph();

    // const res = await this.api.getPage(
    //   'Narushennaya-logika-v-putinskoj-propagande-09-26',
    //   { return_content: true }
    // );

    //const res = await this.api.getAccountInfo({});

    //await this.create(0, 'some title');

    // const md = `## ttt\ntext*dd* _sdf_`
    //
    // console.log(11111, parseMarkdownStr(md));
  }


  /**
   * Create a page
   * @return {string} path like 'some-title-10-30-3'
   */
  async create(channelId: number, title: string, contentMd: string): Promise<string> {
    const result = await this.api.createPage({
      title,
      content: [
        {
          tag: 'p',
          // attrs: {},
          children: ['some string clind'],
        }
      ],
      author_name: this.app.config.channels[channelId].sn.telegram.telegraPhAuthorName,
      author_url: this.app.config.channels[channelId].sn.telegram.telegraPhAuthorUrl,
    });

    return result.path;
  }

}
