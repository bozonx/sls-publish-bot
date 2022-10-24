import { Client, APIResponseError } from "@notionhq/client";
import App from "../App";
import NotionPage from "../notionApi/types/NotionPage";


export default class NotionRequest {
  private notion: Client;
  private readonly app: App;


  constructor(app: App) {
    this.app = app;
    this.notion = new Client({
      auth: this.app.config.notionToken,
    });
  }

  // async init() {
  // }

  async test(channelId: number) {
    // const response = await this.notion.databases.query({
    //   database_id: "FIXME",
    // });
  
    // console.log("Got response:", response);

    // const response = await this.notion.pages.create({
    //   parent: {
    //     database_id: this.app.config.channels[channelId].notionRawPagesDbId
    //   },
    //   properties: {
    //     title: { 
    //       title:[
    //         {
    //           "text": {
    //             "content": 'текст статьи'
    //           }
    //         }
    //       ]
    //     }
    //   },
    // })


    //console.log(await this.notion.users.list({}))

    const response = await this.notion.databases.query({
      database_id: this.app.config.channels[channelId].notionRawPagesDbId,
      page_size: 10,
    });
    // const response = await this.notion.pages.retrieve({

    // // })

    console.log(response.results[0])
    // console.log("Success! Entry added.")
  }


  async getRawPageList(): Promise<NotionPage[]> {
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
