import TgChat from './tgApi/TgChat';
import {askMainMenu} from './askUser/askMainMenu';
// import {askPublishType} from './askUser/askPublishType';
// import {askSNs} from './askUser/askSNs';
import {PublicationTypes} from './types/types';
import {PUBLICATION_TYPES} from './types/consts';
// import PublishArticle from './publishTypes/PublishArticle';
// import PublishPost1000 from './publishTypes/PublishPost1000';
// import PublishStory from './publishTypes/PublishStory';


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



      // askPublishType(channelId, this.tgChat, (pubType: PublicationTypes) => {
      //   askSNs(channelId, pubType, this.tgChat, (sns: string[]) => {
      //     this.startMakingRecord(channelId, pubType, sns)
      //       .catch((e) => {throw e});
      //   })
      //     .catch((e) => {throw e});
      // })
      //   .catch((e) => {throw e});
    });
  }


  private async startMakingRecord(channelId: number, pubType: PublicationTypes, sns: string[]) {
    // switch (pubType) {
    //   case PUBLICATION_TYPES.article:
    //     const article = new PublishArticle(channelId, sns, this.tgChat);
    //
    //     await article.start(channelId);
    //     break;
    //
    //   case PUBLICATION_TYPES.post1000:
    //     const post1000 = new PublishPost1000(channelId, sns, this.tgChat);
    //
    //     await post1000.start(channelId);
    //     break;
    //
    //   // TODO: add post 2000
    //
    //   case PUBLICATION_TYPES.story:
    //     const story = new PublishStory(channelId, sns, this.tgChat);
    //
    //     await story.start(channelId);
    //     break;
    //
    //   default:
    //     throw new Error(`Incorrect publish type`);
    //
    //     break;
    // }

  }

}
