import TgChat from './apiTg/TgChat';
import {askMainMenu, SITE_SELECTED_RESULT} from './askUser/askMainMenu';
import {askChannelMenu, MENU_ADVERT, MENU_MAKE_STORY, MENU_PUBLISH} from './askUser/askChannelMenu';
import PublishFromContentPlan from './publish/PublishFromContentPlan';
import {askSiteMenu} from './askUser/askSiteMenu';


// TODO: поидее нет смысла делать классом - можно просто функции


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await askMainMenu(this.tgChat, (channelId: number) => {
      if (channelId === SITE_SELECTED_RESULT) {
        // site selected
        return askSiteMenu(this.tgChat, () => {
          // TODO: What to do on done???
        })
          .catch((e) => this.tgChat.app.consoleLog.error(e));
      }

      askChannelMenu(
        this.tgChat,
        (action: string) => this.askChannelCb(action, channelId)
      )
        .catch((e) => this.tgChat.app.consoleLog.error(e));
    });
  }


  private askChannelCb(action: string, channelId: number) {
    if (action === MENU_PUBLISH) {
      const publish = new PublishFromContentPlan(channelId, this.tgChat);

      publish.start()
        .catch((e) => this.tgChat.app.consoleLog.error(e));
    }
    else if (action === MENU_MAKE_STORY) {
      // TODO: do it
    }
    else if (action === MENU_ADVERT) {
      // TODO: do it
    }
  }

}
