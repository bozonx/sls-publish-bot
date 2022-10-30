import BreadCrumbs from '../helpers/BreadCrumbs';
import IndexedEventEmitter from '../lib/IndexedEventEmitter';
import {AppEvents} from '../types/consts';
import MainMenuHandler from '../MainMenuHandler';
import App from '../App';
import TgReplyButton from '../types/TgReplyButton';
import BaseState from '../types/BaseState';


export default class TgChat {
  public readonly events: IndexedEventEmitter;
  // chat id where was start function called
  public readonly botChatId: number | string;
  public readonly steps: BreadCrumbs;
  public readonly app: App;
  private readonly mainMenuHandler: MainMenuHandler;


  constructor(chatId: number | string, app: App) {
    this.app = app;
    this.steps = new BreadCrumbs(() => this.mainMenuHandler.startFromBeginning());
    this.events = new IndexedEventEmitter();
    this.mainMenuHandler = new MainMenuHandler(this);
    this.botChatId = chatId;
  }

  async destroy() {
    this.steps.destroy();
    this.events.destroy();
  }


  async startCmd() {
    await this.reply(this.app.i18n.greet);
    // Start from very beginning and cancel current state if need.
    await this.steps.cancel();
  }


  handleCallbackQueryEvent(queryData: any) {
    if (!queryData) {
      this.app.consoleLog.warn('Empty data came to handleCallbackQueryEvent');

      return;
    }

    this.events.emit(AppEvents.CALLBACK_QUERY, queryData);
  }

  handleIncomeMessageEvent(msg: string) {
    if (!msg) {
      this.app.consoleLog.warn('An empty string came to handleIncomeMessageEvent');

      return;
    }

    this.events.emit(AppEvents.MESSAGE, msg);
  }


  async reply(message: string, buttons?: TgReplyButton[][]): Promise<number> {
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.botChatId,
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
    await this.app.tg.bot.telegram.deleteMessage(this.botChatId, messageId);
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
        this.deleteMessage(state.messageId)
          .catch((e) => this.app.consoleLog.warn(`Can't delete menu message: ${e}`));
      },
      onCancel: async (state: BaseState): Promise<void> => {
        for (const item of state.handlerIndexes) {
          this.events.removeListener(item[0], item[1]);
        }
        // don't wait of removing the asking message
        this.deleteMessage(state.messageId)
          .catch((e) => this.app.consoleLog.warn(`Can't delete menu message: ${e}`));
      },
    });
  }

}
