import { Context, Telegraf } from 'telegraf';
import App from './App';
import MainMenuHandler from './MainMenuHandler';
import TgChatContext from './tgApi/TgChatContext';


export default class Tg {
  public readonly bot: Telegraf;
  private readonly app: App;
  private readonly mainMenuHandler: MainMenuHandler;
  // chats where users talk to bot
  private readonly chats: Record<string, TgChatContext> = {};


  constructor(app: App) {
    this.app = app;
    this.bot = new Telegraf(this.app.config.botToken);
    this.mainMenuHandler = new MainMenuHandler(app);
  }


  async init() {
    this.bot.start((ctx: Context) => {
      if (!ctx.chat?.id) throw new Error(`No chat id`);

      if (!this.chats[ctx.chat.id]) {
        this.chats[ctx.chat.id] = new TgChatContext(ctx);
      }

      this.chats[ctx.chat.id].start()
        .catch((e) => {throw e})
    });

    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        console.warn('No chat id in callback_query');

        return;
      }

      this.chats[ctx.chat.id].handleCallbackQueryEvent(ctx.update.callback_query.data);
    });

    await this.bot.launch();

    console.info('--- Bot launched');
  }

}
