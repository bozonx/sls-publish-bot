import { Context, Telegraf } from 'telegraf';
import App from '../App';
import TgChat from './TgChat';


export default class TgMain {
  public readonly bot: Telegraf;
  private readonly app: App;
  // chats where users talk to bot
  private readonly chats: Record<string, TgChat> = {};


  constructor(app: App) {
    this.app = app;
    this.bot = new Telegraf(this.app.config.botToken);
  }


  async init() {
    this.bot.start((ctx: Context) => {
      if (!ctx.chat?.id) throw new Error(`No chat id`);

      if (!this.chats[ctx.chat.id]) {
        this.chats[ctx.chat.id] = new TgChat(ctx.chat.id, this.app);
      }

      this.chats[ctx.chat.id].startCmd()
        .catch((e) => this.app.consoleLog.error(e));
    });

    this.addListeners();

    await this.bot.launch();
    await this.app.channelLog.info('Bot launched');
    this.app.consoleLog.info('Bot launched');
  }

  async destroy(reason: string) {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy();
      // @ts-ignore
      this.chats[itemIndex] = undefined;
    }

    this.bot.stop(reason);
  }


  private addListeners() {
    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.app.consoleLog.warn('No chat id in callback_query');

        return;
      }
      else if (!this.chats[ctx.chat.id]) {
        this.app.consoleLog.error(`No chat id (${ctx.chat.id}) for handling callback query`)

        return;
      }

      this.chats[ctx.chat.id].handleCallbackQueryEvent(ctx.update.callback_query.data);
    });

    // text
    // document
    // poll

    this.bot.on('text', (ctx) => {
      console.log(2222, ctx)
    })

    this.bot.on('photo', (ctx) => {
      console.log(2222, ctx)
    })

    this.bot.on('message', (ctx) => {
      console.log(11111, ctx)

      if (!ctx.chat?.id) {
        this.app.consoleLog.warn('No chat id in callback_query');

        return;
      }
      if (!this.chats[ctx.chat.id]) {
        this.app.consoleLog.error(`No chat id (${ctx.chat.id}) for handling income message`)

        return;
      }

      const msg: string = (ctx.update.message as any).text;

      this.chats[ctx.chat.id].handleIncomeMessageEvent(msg);
    });
  }

}
