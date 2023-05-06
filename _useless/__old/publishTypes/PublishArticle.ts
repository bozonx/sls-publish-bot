import PublishHelper from "../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/publishTypes/PublishHelper";
import NotionListItem from '../../src/notionApi/types/NotionListItem';
import {checkSection, makeSectionsInfo, parseSections} from '../../src/helpers/parseMdBlocks';
import TgChat from '../../src/tgApi/TgChat';
import {askRawPageToUse} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/askRawPageToUse';
import {askPubTime} from '../askPubDate';


export default class PublishArticle {
  private readonly tgChat: TgChat;
  private readonly publishHelper: PublishHelper;


  constructor(channelId: number, sns: string[], tgChat: TgChat) {
    this.tgChat = tgChat;
    this.publishHelper = new PublishHelper(this.tgChat);
  }


  async start(channelId: number) {
    await askRawPageToUse(channelId, this.tgChat, (selectedItem: NotionListItem) => {
      this.parsePage(selectedItem)
        .catch((e) => {throw e});
    });
  }

  async parsePage(selectedItem: NotionListItem) {
    const notionPageContent = await this.tgChat.app.notionRequest.getPageContent(
      selectedItem.pageId
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
    // send result to user
    await this.tgChat.reply(info);

    await askPubTime(this.tgChat, (selectedDateString: string) => {
      // TODO: what to do next ???
    });
  }

}
