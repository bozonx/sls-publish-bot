import App from "../App";
import PublishHelper from "./PublishHelper";
import NotionListItem from '../notionApi/types/NotionListItem';
import {checkSection, makeSectionsInfo, parseSections} from '../lib/parseMdBlocks';
import Sections from '../types/Sections';


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
    const sections = parseSections(notionPageContent[0], notionPageContent[1]);

    try {
      checkSection(sections);
    }
    catch (e) {
      // TODO: написать пользователю
      throw e;
    }

    const info = makeSectionsInfo(sections);

    await this.app.tg.bot.telegram.sendMessage(this.app.tg.botChatId, info)
  }

}
