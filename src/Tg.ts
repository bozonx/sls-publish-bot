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
    this.bot.start((ctx) => {
      this.ctx = ctx;
      this.botChatId = ctx.chat.id;
      this.ctx.reply('Welcome');
      // Start main menu
      this.mainMenuHandler.startFromBeginning().catch((e) => {throw e});
    });

    this.bot.on('callback_query', (ctx) => {
      if (!ctx.update.callback_query.data) throw new Error('Empty data in callback_query');

      this.app.events.emit(AppEvents.CALLBACK_QUERY, ctx.update.callback_query.data);
    });

    await this.bot.launch();

    console.info('--- Launched');
  }

}
