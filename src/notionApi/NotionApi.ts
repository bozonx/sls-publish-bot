import {NotionToMarkdown} from 'notion-to-md';
import { Client } from "@notionhq/client";
import {MdBlock} from 'notion-to-md/build/types';


export default class NotionApi {
  public readonly api: Client;


  constructor(notionToken: string) {
    this.api = new Client({
      auth: notionToken,
    });
  }

  // async getPageMdBlocks(pageId: string): Promise<[Record<string, any>, MdBlock[]]> {
  //   const n2m = new NotionToMarkdown({ notionClient: this.api });
  //   const mdBlocks = await n2m.pageToMarkdown(pageId);
  //   const page = await this.api.pages.retrieve({ page_id: pageId });
  //   const properties = (page as any).properties;
  //
  //   return [properties, mdBlocks];
  // }

}
