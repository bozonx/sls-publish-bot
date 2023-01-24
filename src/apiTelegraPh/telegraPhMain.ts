/*
 * Взято из https://github.com/husky-dev/telegraph-cli
 */
import App from '../App.js';
import {getApi} from './telegraphCli/api.js';
import {TelegraphNode} from './telegraphCli/types.js';
import {makeTelegraPhUrl} from '../helpers/helpers.js';


export default class TelegraPhMain {
  private readonly app: App;
  private readonly api;
  // api with token for images
  private readonly imageApi;


  constructor(app: App) {
    this.app = app;
    this.api = getApi({ token: this.app.appConfig.telegraPhToken });
    // TODO: make token for images
    this.imageApi = getApi({ token: this.app.appConfig.telegraPhToken });
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
      author_name: this.app.blogs[blogName].sn.telegram?.telegraPhAuthorName,
      author_url: this.app.blogs[blogName].sn.telegram?.telegraPhAuthorUrl,
    });

    // TODO: наверное лучше сразу вернуть готовый url
    return result.path;
  }

  /**
   * Just save image in telegraph
   * @param imgUrl {string} - put here full image url in the internet
   * @return {string} image url 'some-title-10-30-3'
   */
  async justSaveImage(imgUrl: string): Promise<string> {
    const content: TelegraphNode[] = [
      {
        tag: 'img',
        attrs: {
          src: imgUrl,
        }
      }
    ]
    const result = await this.imageApi.createPage({ title: imgUrl, content });

    return makeTelegraPhUrl(result.title);
  }

}
