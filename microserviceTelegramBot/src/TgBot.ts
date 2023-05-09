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


  async init() {
    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.ctx.consoleLog.warn('No chat id in callback_query');

        return;
      }
      else if (!this.chats[ctx.chat.id]) {
        ctx.reply(this.ctx.i18n.errors.notRegisteredChat);
        //this.ctx.consoleLog.error(`No chat id (${ctx.chat.id}) for handling callback query`)

        return;
      }

      this.chats[ctx.chat.id].handleCallbackQueryEvent(
        (ctx.update.callback_query as  any).data
      );
    });
  }

  async destroy() {

  }


  async sendMessage(botToken: string) {

  }

  async deleteMessage(botToken: string) {

  }

  onCmdStart(botToken: string) {

  }

  onBotLaunched(botToken: string) {

  }

  onCallbackQuery(botToken: string) {

  }

  onTextMessage(botToken: string) {

  }

  onPhotoMessage(botToken: string) {

  }

  onVideoMessage(botToken: string) {

  }

  onPollMessage(botToken: string) {

  }

}
