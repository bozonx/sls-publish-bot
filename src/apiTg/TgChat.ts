import BreadCrumbs from '../helpers/BreadCrumbs';
import IndexedEventEmitter from '../lib/IndexedEventEmitter';
import {AppEvents} from '../types/constants';
import App from '../App';
import TgReplyButton from '../types/TgReplyButton';
import BaseState from '../types/BaseState';
import {makeBaseState} from '../helpers/helpers';
import BotChatLog from '../helpers/BotChatLog';
import {topLevelMenuStarter} from '../askUser/topLevelMenuStarter';


export default class TgChat {
  public readonly app: App;
  public readonly events: IndexedEventEmitter;
  // chat id where was start function called
  public readonly botChatId: number | string;
  public readonly steps: BreadCrumbs;
  public readonly log: BotChatLog;


  constructor(chatId: number | string, app: App) {
    this.botChatId = chatId;
    this.app = app;
    this.steps = new BreadCrumbs(() => topLevelMenuStarter(this));
    this.events = new IndexedEventEmitter();
    this.log = new BotChatLog(this.app.appConfig.botChatLogLevel, this);
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

  /**
   * No error promise helper.
   * It handles only positive result.
   * If error occurs then it logs it and resolves promise.
   */
  asyncCb = (cb: (...p: any[]) => Promise<void>): (...p: any[]) => Promise<void> => {
    return (...p) => {
      try {
        return new Promise((resolve) => {
          cb(...p)
            .then(resolve)
            .catch((e) => {
              this.app.consoleLog.error(e);
              resolve();
            });
        });
      }
      catch (e) {
        this.app.consoleLog.error(String(e));

        return Promise.resolve();
      }
    }
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


  async reply(
    message: string,
    buttons?: TgReplyButton[][],
    disablePreview = false
  ): Promise<number> {
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.botChatId,
      // TODO: экранировать спец символы и включить parse_mode
      message,
      {
        //parse_mode: this.app.config.telegram.parseMode,
        reply_markup: buttons && {
          inline_keyboard: buttons
        },
        disable_web_page_preview: disablePreview,
      },
    );

    return messageResult.message_id;
  }

  async deleteMessage(messageId: number) {
    await this.app.tg.bot.telegram.deleteMessage(this.botChatId, messageId);
  }

  async addOrdinaryStep(
    onStart: (state: BaseState) => Promise<void>,
    initialState?: BaseState
  ) {
    const initState = initialState || makeBaseState();

    await this.steps.addAndRunStep({
      state: initState,
      onStart: async (state: BaseState): Promise<void> => {
        await onStart(state);
      },
      onEnd: async (state: BaseState): Promise<void> => {
        for (const item of state.handlerIndexes) {
          this.events.removeListener(item[0], item[1]);
        }
        // don't wait of removing the asking message
        for (const messageId of state.messageIds) {
          this.deleteMessage(messageId)
            .catch((e) => this.app.consoleLog.warn(`Can't delete menu message: ${e}`));
        }
      },
      onCancel: async (state: BaseState): Promise<void> => {
        for (const item of state.handlerIndexes) {
          this.events.removeListener(item[0], item[1]);
        }
        // don't wait of removing the asking message
        for (const messageId of state.messageIds) {
          this.deleteMessage(messageId)
            .catch((e) => this.app.consoleLog.warn(`Can't delete menu message: ${e}`));
        }
      },
    });
  }

}
