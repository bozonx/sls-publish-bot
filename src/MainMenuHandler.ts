import TgChat from './tgApi/TgChat';
import {askMainMenu} from './askUser/askMainMenu';
import {askPublishType} from './askUser/askPublishType';
import {askSNs} from './askUser/askSNs';


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await askMainMenu(this.tgChat, (channelId: number) => {
      askPublishType(channelId, this.tgChat, () => {
        askSNs(channelId, this.tgChat, () => {
          // TODO: what to do ???
        })
      })
        .catch((e) => {throw e});
    });
  }

}
