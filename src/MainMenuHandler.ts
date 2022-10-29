import TgChat from './tgApi/TgChat';
import {askMainMenu} from './askUser/askMainMenu';
import {askChannelMenu, MENU_ADVERT, MENU_MAKE_STORY, MENU_PUBLISH} from './askUser/askChannelMenu';
import PublishMaterial from './publish/PublishMaterial';


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await askMainMenu(this.tgChat, (channelId: number) => {
      if (channelId === -1) {
        // site selected
        return;
      }

      askChannelMenu(this.tgChat, (action: string) => {
        if (action === MENU_PUBLISH) {
          const publish = new PublishMaterial(channelId, this.tgChat);

          publish.start()
            .catch((e) => {throw e});
        }
        else if (action === MENU_MAKE_STORY) {
          // TODO: do it
        }
        else if (action === MENU_ADVERT) {
          // TODO: do it
        }
      })
        .catch((e) => {throw e});
    });
  }

}
