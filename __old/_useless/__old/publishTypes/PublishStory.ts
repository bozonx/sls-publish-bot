import PublishHelper from "../../../../../../../../mnt/disk2/workspace/sls-publish-bot/_useless/publishTypes/PublishHelper";
import TgChat from '../../src/tgApi/TgChat';


export default class PublishStory {
  private readonly tgChat: TgChat;
  private readonly publishHelper: PublishHelper;


  constructor(channelId: number, sns: string[], tgChat: TgChat) {
    this.tgChat = tgChat;
    this.publishHelper = new PublishHelper(this.tgChat);
  }


  async start(channelId: number) {

    console.log(1111, channelId)
  }

}
