import {Context, Telegraf} from 'telegraf';
import {Message, PhotoSize, Video} from 'typegram/message';


export class TgBot {
  private readonly bot: Telegraf;
  // TODO: лучше не создавать инстансы бота, а напрямую делать запросы

  constructor() {
    // TODO: токен брать как-то по другому, ведь юзер сам может задать своего бота
    this.bot = new Telegraf(this.ctx.config.botToken, {
      telegram: {
        testEnv: !this.ctx.config.isProduction,
      }
    })
  }


  async sendMessage() {

  }

  async deleteMessage() {

  }

  onCmdStart() {

  }

  onBotLaunched() {

  }

  onCallbackQuery() {

  }

  onTextMessage() {

  }

  onPhotoMessage() {

  }

  onVideoMessage() {

  }

  onPollMessage() {

  }

}
