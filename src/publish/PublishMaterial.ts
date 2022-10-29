import TgChat from '../tgApi/TgChat';


export default class PublishMaterial {
  private readonly channelId: number;
  private readonly tgChat: TgChat;


  constructor(channelId: number, tgChat: TgChat) {
    this.channelId = channelId;
    this.tgChat = tgChat;
  }


  async start() {
    // TODO: * запрашиваем контент план, фильтруем сегодня и после, не выложенное
    //       * выводим в виде кнопок - дата и название, спрашиваем что использовать
    //       * парсим и выводим инфу для проверки или ошибки если не всё заполнено
    //       * спрашиваем подтверждения
    //       * публикуем

    await this.loadNotPublished();
  }


  /**
   * Load not published items from content plan
   */
  private async loadNotPublished() {
    // TODO: отфильтровать
    const contentPlanItems = await this.tgChat.app.notion.getDbItemList(
      this.tgChat.app.config.channels[this.channelId].notionContentPlanDbId
    );

    console.log(11111, contentPlanItems)
  }

}
