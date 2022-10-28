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
        this.chats[ctx.chat.id] = new TgChat(ctx, this.app);
      }

      this.chats[ctx.chat.id].start()
        .catch((e) => {throw e});
    });

    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        console.warn('No chat id in callback_query');

        return;
      }

      this.chats[ctx.chat.id].handleCallbackQueryEvent(ctx.update.callback_query.data);
    });

    this.bot.on('message', (ctx) => {
      const msg: string = (ctx.update.message as any).text;

      this.chats[ctx.chat.id].handleIncomeMessageEvent(msg);
    })

    await this.bot.launch();

    console.info('--- Bot launched');
  }

}
