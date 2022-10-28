import PublishHelper from "./PublishHelper";
import NotionListItem from '../notionApi/types/NotionListItem';
import {checkSection, makeSectionsInfo, parseSections} from '../lib/parseMdBlocks';
import TgChat from '../tgApi/TgChat';


export default class PublishArticle {
  private readonly tgChat: TgChat;
  private readonly publishHelper: PublishHelper;


  constructor(channelId: number, sns: string[], tgChat: TgChat) {
    this.tgChat = tgChat;
    this.publishHelper = new PublishHelper(this.tgChat);
  }


  async start(channelId: number) {
    const notionPage: NotionListItem = await this.publishHelper.askPageToUse(channelId);
    const notionPageContent = await this.tgChat.app.notionRequest.getPageContent(
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
