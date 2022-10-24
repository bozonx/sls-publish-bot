import { Client, APIResponseError } from "@notionhq/client";
import NotionPage from "./types/NotionPage";
import {DB_DEFAULT_PAGE_SIZE} from "./constants";
import {PartialPageObjectResponse, QueryDatabaseResponse} from "@notionhq/client/build/src/api-endpoints";


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

  async getDbItemList(dbId: string, page_size = DB_DEFAULT_PAGE_SIZE): Promise<PartialPageObjectResponse[]> {
    const response = await this.notion.databases.query({
      database_id: dbId,
      page_size,
    });

    return response.results;
  }

  async getPreparedDbItemList(dbId: string, page_size = DB_DEFAULT_PAGE_SIZE) {
    const items = await this.getDbItemList(dbId, page_size);

    console.log(2222, items)
  }

}
