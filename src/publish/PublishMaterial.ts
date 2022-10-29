import TgChat from '../tgApi/TgChat';


export default class PublishMaterial {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async start(channelId: number) {
    // TODO: * запрашиваем контент план, фильтруем сегодня и после, не выложенное
    //       * выводим в виде кнопок - дата и название, спрашиваем что использовать
    //       * парсим и выводим инфу для проверки или ошибки если не всё заполнено
    //       * спрашиваем подтверждения
    //       * публикуем
  }

}
