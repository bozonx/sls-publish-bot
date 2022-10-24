import {NotionToMarkdown} from 'notion-to-md';
import { Client, APIResponseError } from "@notionhq/client";
import NotionListItem from "./types/NotionPage";
import {DB_DEFAULT_PAGE_SIZE} from "./constants";
import {
  GetBlockResponse,
  GetPageResponse, ListBlockChildrenResponse,
  PageObjectResponse, RichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";
import NotionPage from './types/NotionPage';


export default class NotionApi {
  private notion: Client;


  constructor(notionToken: string) {
    this.notion = new Client({
      auth: notionToken,
    });
  }

  async init() {
    // TODO: wait initialization finished
  }

  async getDbItemList(dbId: string, page_size = DB_DEFAULT_PAGE_SIZE): Promise<PageObjectResponse[]> {
    const response = await this.notion.databases.query({
      database_id: dbId,
      page_size,
    });

    return response.results as PageObjectResponse[];
  }

  async getPreparedDbItemList(
    dbId: string,
    page_size = DB_DEFAULT_PAGE_SIZE
  ): Promise<NotionListItem[]> {
    const items = await this.getDbItemList(dbId, page_size);

    return items.map((item): NotionListItem => {

      const NameProp = item.properties.Name
      const richTextTitle: RichTextItemResponse = (NameProp as any).title[0]

      return {
        pageId: item.id,
        title: richTextTitle.plain_text,
      }
    });

  }

  async getPage(pageId: string): Promise<NotionPage> {
    const n2m = new NotionToMarkdown({ notionClient: this.notion });

    const result = await n2m.pageToMarkdown(pageId);

    console.log(result)

    // const result: GetBlockResponse = await this.notion.blocks.retrieve({block_id: pageId});
    //
    // console.log(result)
    //
    // const resultChildren: ListBlockChildrenResponse = await this.notion.blocks.children.list({block_id: pageId});
    //
    // // @ts-ignore
    // console.log(222, resultChildren.results[0].paragraph.rich_text)


    throw new Error('1111')
  }

}
