import { ignorePromiseError } from "./lib/common";
import PublishArticle from "./publishTypes/PublishArticle";
import PublishPost1000 from "./publishTypes/PublishPost1000";
import PublishStory from "./publishTypes/PublishStory";
import {
  AppEvents,
  MENU_MANAGE_SITE,
  PublicationTypes
} from "./types/consts";
import TgChat from './tgApi/TgChat';
import BaseState from './types/BaseState';
import {makeBaseState} from './helpers/helpers';
import {askMainMenu} from './askUser/askMainMenu';
import {askPublishType} from './askUser/askPublishType';







// TODO: выбрать соцсети


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await askMainMenu(this.tgChat, () => {
      askPublishType(this.tgChat, () => {

      })
        .catch((e) => {throw e});
    });
  }






  private async startMakingRecord(channelId: number, selectedType: string) {
    await this.tgChat.reply(
      this.tgChat.app.i18n.menu.selectedType
      + this.tgChat.app.i18n.publicationType[selectedType]
    );

    switch (selectedType) {
      case MENU_MAKE_ARTICLE:
        const article = new PublishArticle(this.app);

        await article.start(channelId);
        break;

      case MENU_MAKE_POST1000:
        const post1000 = new PublishPost1000(this.app);

        await post1000.start(channelId);
        break;

      case MENU_MAKE_STORY:
        const story = new PublishStory(this.app);

        await story.start(channelId);
        break;

      default:
        break;
    }
  }
}
