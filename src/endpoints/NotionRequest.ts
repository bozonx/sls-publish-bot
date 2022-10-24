import App from "../App";
import NotionPage from "../notionApi/types/NotionPage";
import NotionApi from "../notionApi/NotionApi";
import NotionListItem from '../notionApi/types/NotionListItem';
import {MdBlock} from 'notion-to-md/build/types';


export default class NotionRequest {
  private notion: NotionApi;
  private readonly app: App;


  constructor(app: App) {
    this.app = app;
    this.notion = new NotionApi(this.app.config.notionToken)
  }

  // async init() {
  // }

  // async test(channelId: number) {
  //   await this.notion.getPreparedDbItemList(this.app.config.channels[channelId].notionRawPagesDbId)
  //
  // }


  async getDbList(dbId: string): Promise<NotionListItem[]> {
    return this.notion.getPreparedDbItemList(dbId);
  }

  async getPageContent(pageId: string): Promise<MdBlock[]> {
    return this.notion.getPageMdBlocks(pageId);
  }

}
