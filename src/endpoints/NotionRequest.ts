import App from "../App";
import NotionPage from "../notionApi/types/NotionPage";
import NotionApi from "../notionApi/NotionApi";


export default class NotionRequest {
  private notion: NotionApi;
  private readonly app: App;


  constructor(app: App) {
    this.app = app;
    this.notion = new NotionApi(this.app.config.notionToken)
  }

  // async init() {
  // }

  async test(channelId: number) {
    await this.notion.getPreparedDbItemList(this.app.config.channels[channelId].notionRawPagesDbId)

  }


  async getRawPageList(): Promise<NotionPage[]> {
    return [
      {
        pageId: '123',
        title: 'заголовок заготовки',
      },
    ];
  }

  async getPageContent(pageId: string): Promise<string> {
    return 'connnnntent';
  }

}
