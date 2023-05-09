import {IndexedEventEmitter} from 'squidlet-lib';
import {Context, Telegraf} from 'telegraf';
import {Message, PhotoSize, Video} from 'typegram/message';
import {Main} from './Main.js';


const EVENT_DELIMITER = '|'

export enum TG_BOT_EVENT {
  cmdStart,
  launched,
  callbackQuery,
}


export class TgBot {
  private readonly main: Main
  private events = new IndexedEventEmitter()
  private readonly bot: Telegraf;

  // TODO: лучше не создавать инстансы бота, а напрямую делать запросы

  constructor(main: Main) {
    this.main = main
    // TODO: токен брать как-то по другому, ведь юзер сам может задать своего бота
    this.bot = new Telegraf(this.main.config.testBotToken, {
      telegram: {
        testEnv: !this.main.config.isProduction,
      }
    })
  }


  async init() {
    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.main.log.warn('No chat id in callback_query');

        return;
      }

      const eventName = this.main.config.testBotToken
        + EVENT_DELIMITER + TG_BOT_EVENT.callbackQuery

      this.events.emit(eventName, ctx.chat.id, (ctx.update.callback_query as  any).data)
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

  onCallbackQuery(botToken: string, handler: (chatId: number | string, queryData: string) => void): number {
    const eventName = botToken + EVENT_DELIMITER + TG_BOT_EVENT.callbackQuery

    return this.events.addListener(eventName, handler)
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
