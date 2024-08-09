import {upload, Telegraph} from "better-telegraph"
import type {Account, PageList, NodeElement} from "better-telegraph"


export function makeTelegraPhUrl(tgPath: string): string {
  return `https://telegra.ph/${tgPath}`
}


export class TelegraPhCtl {
  private readonly api


  constructor(accessToken: string) {
    this.api = new Telegraph({
      accessToken,
    });
  }


  async getAccount(): Promise<Account> {
    return this.api.getAccount()
  }

  async getPages(limit: number, offset = 0): Promise<PageList> {
    return this.api.getPages({ limit, offset })
  }

  /**
   * Create a page
   * see https://www.npmjs.com/package/better-telegraph#create
   * @return {string} path like 'some-title-10-30-3'
   */
  async create(
    title: string,
    content: NodeElement[],
    authorName: string,
    authorUrl: string
  ): Promise<string> {
    const res = await this.api.create({
      title,
      content,
      author_name: authorName,
      author_url: authorUrl,
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
    return await upload(imgUrl)
  }

}
