import {Context} from 'telegraf';
import BreadCrumbs from '../helpers/BreadCrumbs';
import IndexedEventEmitter from '../lib/IndexedEventEmitter';
import {AppEvents} from '../types/consts';
import MainMenuHandler from '../MainMenuHandler';
import App from '../App';
import TgReplyButton from '../types/TgReplyButton';
import BaseState from '../types/BaseState';
import {ignorePromiseError} from '../lib/common';


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
    this.steps = new BreadCrumbs(() => this.mainMenuHandler.startFromBeginning());
    this.events = new IndexedEventEmitter();
    this.mainMenuHandler = new MainMenuHandler(this);
    this.botChatId = ctx.chat.id;
  }

  async start() {
    await this.ctx.reply(this.app.i18n.greet);
    // Start from very beginning and cancel current state if need.
    await this.steps.cancel();
  }

  async destroy() {
    // TODO: add
  }

  handleCallbackQueryEvent(queryData: any) {
    if (!queryData) {
      console.warn('Empty data in callback_query');

      return;
    }

    this.events.emit(AppEvents.CALLBACK_QUERY, queryData);
  }

  handleIncomeMessageEvent(msg: string) {
    if (!msg) {
      console.warn('An empty string came');

      return;
    }

    this.events.emit(AppEvents.MESSAGE, msg);
  }


  async reply(message: string, buttons?: TgReplyButton[][]): Promise<number> {
    const messageResult = await this.ctx.sendMessage(
      message,
      buttons && {
        reply_markup: {
          inline_keyboard: buttons
        }
      }
    );

    return messageResult.message_id;
  }

  async deleteMessage(messageId: number) {
    await this.ctx.deleteMessage(messageId);
  }

  async addOrdinaryStep(initialState: BaseState, onStart: (state: BaseState) => Promise<void>) {
    await this.steps.addAndRunStep({
      state: initialState,
      onStart: async (state: BaseState): Promise<void> => {
        await onStart(state);
      },
      onEnd: async (state: BaseState): Promise<void> => {
        for (const item of state.handlerIndexes) {
          this.events.removeListener(item[0], item[1]);
        }
        // don't wait of removing the asking message
        ignorePromiseError(this.deleteMessage(state.messageId));
      },
      onCancel: async (state: BaseState): Promise<void> => {
        for (const item of state.handlerIndexes) {
          this.events.removeListener(item[0], item[1]);
        }
        // don't wait of removing the asking message
        ignorePromiseError(this.deleteMessage(state.messageId));
      },
    });
  }

}
