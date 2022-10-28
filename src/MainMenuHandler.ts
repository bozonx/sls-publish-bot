import TgChat from './tgApi/TgChat';
import {askMainMenu} from './askUser/askMainMenu';
import {askPublishType} from './askUser/askPublishType';
import {askSNs} from './askUser/askSNs';
import {PublicationTypes} from './types/types';


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await askMainMenu(this.tgChat, (channelId: number) => {
      askPublishType(channelId, this.tgChat, (pubType: PublicationTypes) => {
        askSNs(channelId, pubType, this.tgChat, (sns: string[]) => {
          // TODO: what to do ???
        })
      })
        .catch((e) => {throw e});
    });
  }

}
