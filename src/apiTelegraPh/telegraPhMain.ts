/*
 * Взято из https://github.com/husky-dev/telegraph-cli
 */
import {getApi} from './telegraphCli/api';
import App from '../App';
import {TelegraphNode} from './telegraphCli/types';


export default class TelegraPhMain {
  private readonly app: App;
  private readonly api;


  constructor(app: App) {
    this.app = app;
    this.api = getApi({ token: this.app.config.telegraPhToken });


  }

  async init() {


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
  async create(blogName: string, title: string, content: TelegraphNode[]): Promise<string> {
    const result = await this.api.createPage({
      title,
      content,
      author_name: this.app.config.blogs[blogName].sn.telegram?.telegraPhAuthorName,
      author_url: this.app.config.blogs[blogName].sn.telegram?.telegraPhAuthorUrl,
    });

    return result.path;
  }

}
