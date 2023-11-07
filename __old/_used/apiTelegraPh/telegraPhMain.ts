import System from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/System';
import {Account, PageList, Telegraph, upload, NodeElement} from "better-telegraph";
import {makeTelegraPhUrl} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/helpers';


export default class TelegraPhMain {
  private readonly app: System;
  private readonly api;


  constructor(app: System) {
    this.app = app;
    this.api = new Telegraph({
      accessToken: this.app.appConfig.telegraPhToken,
    });
  }

  async init() {
  }


  async getAccount(): Promise<Account> {
    return this.api.getAccount()
  }

  async getPages(limit: number, offset = 0): Promise<PageList> {
    const res: PageList = await this.api.getPages({ limit, offset });

    return res
  }

  /**
   * Create a page
   * see https://www.npmjs.com/package/better-telegraph#create
   * @return {string} path like 'some-title-10-30-3'
   */
  async create(blogName: string, title: string, content: NodeElement[]): Promise<string> {
    const res = await this.api.create({
      title,
      content,
      author_name: this.app.blogs[blogName].sn.telegram?.telegraPhAuthorName,
      author_url: this.app.blogs[blogName].sn.telegram?.telegraPhAuthorUrl,
      //return_content: true, // Optional. Defaults to `false`.
    });

    return makeTelegraPhUrl(res.path)
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
