import {Context} from 'telegraf';
import BreadCrumbs from '../helpers/BreadCrumbs';
import IndexedEventEmitter from '../lib/IndexedEventEmitter';
import {AppEvents} from '../types/consts';
import MainMenuHandler from '../MainMenuHandler';
import App from '../App';
import TgReplyButton from '../types/TgReplyButton';


export default class TgChat {
  public readonly events: IndexedEventEmitter;
  // context of start function
  public readonly ctx: Context;
  // chat id where was start function called
  public readonly botChatId: number;
  public readonly steps: BreadCrumbs;
  public readonly app: App;
  private readonly mainMenuHandler: MainMenuHandler;


  constructor(ctx: Context, app: App) {
    if (!ctx.chat?.id) throw new Error(`No chat id`);

    this.ctx = ctx;
    this.app = app;
    this.steps = new BreadCrumbs(() => this.initialStep());
    this.events = new IndexedEventEmitter();
    this.mainMenuHandler = new MainMenuHandler(this);
    this.botChatId = ctx.chat.id;
  }

  async start() {
    // Start from very beginning and cancel current state if need.
    await this.steps.cancel();
  }

  handleCallbackQueryEvent(queryData: any) {
    if (!queryData) {
      console.warn('Empty data in callback_query');

      return;
    }

    this.events.emit(AppEvents.CALLBACK_QUERY, queryData);
  }


  async reply(message: string, buttons?: TgReplyButton[]): Promise<number> {
    const messageResult = await this.ctx.reply(
      this.app.i18n.menu.selectChannel,
      buttons && {
        reply_markup: {
          inline_keyboard: [ buttons ]
        }
      }
    );

    return messageResult.message_id;
  }

  async deleteMessage(messageId: number) {
    await this.ctx.deleteMessage(messageId);
  }


  private async initialStep() {
    await this.ctx.reply(this.app.i18n.greet);
    // Start main menu
    await this.mainMenuHandler.startFromBeginning();
  }

}
