import { Client } from "@notionhq/client";


export default class NotionApi {
  public readonly api: Client;


  constructor(notionToken: string) {
    this.api = new Client({
      auth: notionToken,
    });
  }

}
