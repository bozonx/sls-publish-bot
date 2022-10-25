import {Context} from 'telegraf';
import BreadCrumbs from '../helpers/BreadCrumbs';
import IndexedEventEmitter from '../lib/IndexedEventEmitter';
import {AppEvents} from '../types/consts';


export default class TgChatContext {
  public readonly events: IndexedEventEmitter;
  // context of start function
  public readonly ctx: Context;
  // chat id where was start function called
  public readonly botChatId: number;
  public readonly steps: BreadCrumbs;


  constructor(ctx: Context) {
    this.ctx = ctx;
    this.steps = new BreadCrumbs(() => this.initialStep());
    this.events = new IndexedEventEmitter();

    if (!this.ctx.chat?.id) throw new Error(`No chat id`);

    this.botChatId = this.ctx.chat.id;
  }

  async start() {
    //this.initialStep(this.chats[ctx.chat.id]);
  }

  handleCallbackQueryEvent(queryData: any) {
    if (!queryData) {
      console.warn('Empty data in callback_query');

      return;
    }

    this.events.emit(AppEvents.CALLBACK_QUERY, queryData);
  }

  async initialStep() {
    // TODO: !!!!
    await this.bot.telegram.sendMessage(this.botChatId, 'Welcome');
    // TODO: !!!!
    // Start main menu
    await this.mainMenuHandler.startFromBeginning();
  }


}
