import App from "../App";
import PublishHelper from "./PublishHelper";


export default class PublishArticle {
  private readonly app: App;
  private readonly publishHelper: PublishHelper;


  constructor(app: App) {
    this.app = app;
    this.publishHelper = new PublishHelper(this.app);
  }


  async start(channelId: number, menuAction: string) {
    const notionPage = await this.publishHelper.askPageToUse(channelId);
    const notionPageContent = await this.app.notionRequest
      .getPageContent(notionPage.pageId)

    console.log(1111, channelId, menuAction, notionPageContent)
  }

}
