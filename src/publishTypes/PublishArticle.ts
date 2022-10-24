import App from "../App";
import PublishHelper from "./PublishHelper";
import NotionListItem from '../notionApi/types/NotionListItem';


export default class PublishArticle {
  private readonly app: App;
  private readonly publishHelper: PublishHelper;


  constructor(app: App) {
    this.app = app;
    this.publishHelper = new PublishHelper(this.app);
  }


  async start(channelId: number) {
    const notionPage: NotionListItem = await this.publishHelper.askPageToUse(channelId);
    const notionPageContent = await this.app.notionRequest.getPageContent(
      notionPage.pageId
    );

    console.log(33333, channelId, notionPageContent)
  }

}
