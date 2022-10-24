import { Client, APIResponseError } from "@notionhq/client";
//import fetch from "node-fetch";
import App from "../App";
import NotionPage from "../types/NotionPage";

// const fetch = (...args: any[]) => import('node-fetch')
//   // @ts-ignore
//   .then(({default: fetch}) => fetch(...args));

export default class NotionRequest {
  private notion: Client;
  private readonly app: App;


  constructor(app: App) {
    this.app = app;
    this.notion = new Client({
      auth: this.app.config.notionToken,
      //fetch: fetch,
    });
  }

  // async init() {
  // }

  async test(channelId: number) {
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


    console.log(await this.notion.users.list({}))

    // const response = await this.notion.databases.query({
    //   database_id: this.app.config.channels[channelId].notionRawPagesDbId,
    //   page_size: 10,
    // })
    // // const response = await this.notion.pages.retrieve({

    // // })

    // console.log(111, response)
    // console.log("Success! Entry added.")
  }


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
