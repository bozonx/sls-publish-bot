import { Context, Telegraf } from 'telegraf';
import App from './App';
import MainMenuHandler from './MainMenuHandler';
import { AppEvents } from './types/consts';


export default class Tg {
  public readonly bot: Telegraf;
  public ctx!: Context;
  public botChatId!: number;
  private readonly app: App;
  private readonly mainMenuHandler: MainMenuHandler


  constructor(app: App) {
    this.app = app;
    this.bot = new Telegraf(this.app.config.botToken);
    this.mainMenuHandler = new MainMenuHandler(app);
  }


  async init() {
    this.bot.start(async (ctx) => {
      this.ctx = ctx;
      this.botChatId = ctx.chat.id;
      this.ctx.reply('Welcome');

      this.mainMenuHandler.askPublishType().catch((e) => {throw e});
    });

    this.bot.on('callback_query', (ctx) => {
      if (!ctx.update.callback_query.data) throw new Error('Empty data in callback_query');

      this.app.events.emit(AppEvents.CALLBACK_QUERY, ctx.update.callback_query.data);
    });

    this.bot.launch();
  }

}



      //bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.', {
      //})
    // bot.help((ctx) => ctx.reply('Send me a sticker'));
    // bot.hears('hi', (ctx) => ctx.reply('Hey there'));

