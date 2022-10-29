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


  // async getDbItemList(dbId: string, page_size = DB_DEFAULT_PAGE_SIZE): Promise<PageObjectResponse[]> {
  //   const currentDate: string = moment()
  //     .utcOffset(this.utcOffset).format('YYYY-MM-DD');
  //
  //   const response = await this.notion.databases.query({
  //     database_id: dbId,
  //     page_size,
  //     filter: {
  //       and: [
  //         {
  //           property: 'date',
  //           date: {
  //             on_or_after: currentDate,
  //           },
  //         },
  //         {
  //           or: [
  //             {
  //               property: 'status',
  //               select: {
  //                 equals: 'to_edit',
  //               },
  //             },
  //             {
  //               property: 'status',
  //               select: {
  //                 equals: 'to_correct',
  //               },
  //             },
  //             {
  //               property: 'status',
  //               select: {
  //                 equals: 'to_publish',
  //               },
  //             },
  //           ],
  //         }
  //       ],
  //
  //     },
  //   });
  //
  //   return response.results as PageObjectResponse[];
  // }

  // makePreparedDbItemList(results: PageObjectResponse[]): NotionListItem[] {
  //   return results
  //     .filter((item) => !item.archived)
  //     .map((item): NotionListItem => {
  //       const NameProp = item.properties[SECTIONS_NAMES.Header]
  //       const richTextTitle: RichTextItemResponse = (NameProp as any).title[0]
  //
  //       return {
  //         pageId: item.id,
  //         title: richTextTitle.plain_text,
  //       }
  //     });
  // }

  async getPageMdBlocks(pageId: string): Promise<[Record<string, any>, string]> {
    const n2m = new NotionToMarkdown({ notionClient: this.api });
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const page = await this.api.pages.retrieve({ page_id: pageId });
    const properties = (page as any).properties;

    return [properties, mdString];
  }

}
