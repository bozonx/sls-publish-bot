import { Client } from "@notionhq/client";
import App from "../App";
import NotionPage from "../types/NotionPage";


export default class NotionRequest {
  private notion: Client;
  private readonly app: App;


  constructor(app: App) {
    this.app = app;
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  // async init() {
  // }


  async getRawPageList(): Promise<NotionPage[]> {
    const response = await this.notion.databases.query({
      database_id: "FIXME",
    });
  
    console.log("Got response:", response);

    return [
      {
        pageId: '123',
        caption: 'заголовок заготовки',
      },
    ];
  }

  async getPageContent(pageId: string): Promise<string> {
    return 'connnnntent';
  }

}
