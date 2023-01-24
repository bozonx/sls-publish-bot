/*
 * Взято из https://github.com/husky-dev/telegraph-cli
 */

import App from '../App.js';
import {TelegraphNode} from './telegraphCli/types.js';
import {Account, PageList, Telegraph, upload} from "better-telegraph";


export default class TelegraPhMain {
  private readonly app: App;
  private readonly api;


  constructor(app: App) {
    this.app = app;
    // const api = new Telegraph({
    //   accessToken: this.app.appConfig.telegraPhToken,
    // });
    //this.api = getApi({ token: this.app.appConfig.telegraPhToken });
    this.api = new Telegraph({
      accessToken: this.app.appConfig.telegraPhToken,
    });
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


  async getAccount(): Promise<Account> {
    return this.api.getAccount()
  }

  async getPages(limit: number, offset = 0) {
    const res: PageList = await this.api.getPages({ limit, offset });

    return res
  }

  /**
   * Create a page
   * @return {string} path like 'some-title-10-30-3'
   */
  async create(blogName: string, title: string, content: TelegraphNode[]): Promise<string> {
    return ''
    // const result = await this.api.createPage({
    //   title,
    //   content,
    //   author_name: this.app.blogs[blogName].sn.telegram?.telegraPhAuthorName,
    //   author_url: this.app.blogs[blogName].sn.telegram?.telegraPhAuthorUrl,
    // });
    //
    // // TODO: наверное лучше сразу вернуть готовый url
    // return result.path;
  }

  /**
   * Just save image in telegraph
   * @param imgUrl {string} - put here full image url in the internet
   * @return {string} full image url
   */
  async uploadImage(imgUrl: string): Promise<string> {
    return await upload(imgUrl);
  }

}



// const re = await axios({
//   method: 'get',
//   url: imgUrl,
//   headers: {
//     'Content-Type': 'image/jpg',
//   }
// });
//
// //console.log(1111, re)
//
//
// const form = new FormData();
//
// //form.append('photo', got.stream(imgUrl) as any);
// form.append('file', re.data);
// //form.append('file', fs.createReadStream(imgUrl) as any);
// //form.append('file', imgUrl);
//
// const result = await axios({
//   method: 'post',
//   url: 'https://telegra.ph/upload',
//   //data: form,
//   data: re.data,
//   //data: got.stream(imgUrl),
//   headers: {
//     //'Content-Type': 'image/jpg',
//     'Content-Type': 'multipart/form-data'
//     //...form.getHeaders()
//   }
//   // Authorization
//   //headers: { 'Content-Type': 'image/jpg' }
//   //image/png
// })
//
// console.log(222, result.data)


/*


POST /upload HTTP/2
Accept: application/json, text/javascript
Content-Type: multipart/form-data;
 */


// const content: TelegraphNode[] = [
//   {
//     tag: 'img',
//     attrs: {
//       src: imgUrl,
//     }
//   }
// ]
// const result = await this.imageApi.createPage({ title: imgUrl, content });
//
// console.log(2222, result)
//
// return result.title;
