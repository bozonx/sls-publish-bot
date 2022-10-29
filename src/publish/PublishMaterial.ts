import TgChat from '../tgApi/TgChat';


export default class PublishMaterial {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async start(channelId: number) {

  }

}