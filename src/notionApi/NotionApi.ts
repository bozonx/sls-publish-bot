import {NotionToMarkdown} from 'notion-to-md';
import { Client } from "@notionhq/client";
import NotionListItem from "./types/NotionPage";
import {DB_DEFAULT_PAGE_SIZE} from "./constants";
import {
  PageObjectResponse, RichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";
import {MdBlock} from 'notion-to-md/build/types';
import {SECTIONS_NAMES} from '../types/consts';


export default class NotionApi {
  private readonly notion: Client;


  constructor(notionToken: string) {
    this.notion = new Client({
      auth: notionToken,
    });
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
      // TODO: skip archived
      //if (item.archived) return;

      const NameProp = item.properties[SECTIONS_NAMES.Header]
      const richTextTitle: RichTextItemResponse = (NameProp as any).title[0]

      return {
        pageId: item.id,
        title: richTextTitle.plain_text,
      }
    });

  }

  async getPageMdBlocks(pageId: string): Promise<[Record<string, any>, MdBlock[]]> {
    const n2m = new NotionToMarkdown({ notionClient: this.notion });
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const page = await this.notion.pages.retrieve({ page_id: pageId });
    const properties = (page as any).properties;

    return [properties, mdBlocks];
  }

}
