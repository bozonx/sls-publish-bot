import App from "../App";
import NotionPage from "../types/NotionPage";


export default class NotionRequest {
  private readonly app: App;


  constructor(app: App) {
    this.app = app;
  }

  async init() {

  }


  /**
   * Get pre publish pages list.
   */
  async getRawPageList(): Promise<NotionPage[]> {
    return [
      {
        pageId: 'qwe',
        caption: '123',
      },
    ];
  }

  async getPage() {

  }

}
