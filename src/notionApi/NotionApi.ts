import { Client, APIResponseError } from "@notionhq/client";
import NotionListItem from "./types/NotionPage";
import {DB_DEFAULT_PAGE_SIZE} from "./constants";
import {
  PageObjectResponse, RichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";


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

    console.log(2222, items)

    return items.map((item): NotionListItem => {

      const NameProp = item.properties.Name
      const richTextTitle: RichTextItemResponse = (NameProp as any).title[0]

      return {
        pageId: item.id,
        title: richTextTitle.plain_text,
      }
    });

  }

}
