import App from '../App.js';
import BreadCrumbs from '../helpers/BreadCrumbs.js';
import IndexedEventEmitter from '../lib/IndexedEventEmitter.js';
import {ChatEvents} from '../types/constants.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import BaseState from '../types/BaseState.js';
import {makeBaseState} from '../helpers/helpers.js';
import BotChatLog from '../helpers/BotChatLog.js';
import {topLevelMenuStarter} from '../askUser/topLevelMenuStarter.js';
import {
  MediaGroupItemMessageEvent,
  PhotoMessageEvent,
  PollMessageEvent,
  TextMessageEvent,
  VideoMessageEvent
} from '../types/MessageEvent.js';


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

    this.events.emit(ChatEvents.CALLBACK_QUERY, queryData);
  }

  handleIncomeTextEvent(msgEvent: TextMessageEvent) {
    this.events.emit(ChatEvents.TEXT, msgEvent);
  }

  handleIncomePhotoEvent(msgEvent: PhotoMessageEvent) {
    this.events.emit(ChatEvents.PHOTO, msgEvent);
  }

  handleIncomeVideoEvent(msgEvent: VideoMessageEvent) {
    this.events.emit(ChatEvents.VIDEO, msgEvent);
  }

  // handleIncomeMediaGroupItemEvent(msgEvent: MediaGroupItemMessageEvent) {
  //   this.events.emit(ChatEvents.MEDIA_GROUP_ITEM, msgEvent);
  // }

  handleIncomePollEvent(msgEvent: PollMessageEvent) {
    this.events.emit(ChatEvents.POLL, msgEvent);
  }

  async reply(
    message: string,
    buttons?: TgReplyButton[][],
    disablePreview = false,
    md = false
  ): Promise<number> {
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.botChatId,
      message,
      {
        parse_mode: (md) ? this.app.appConfig.telegram.parseMode : undefined,
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

    // TODO: когда запускается onDone собития должны все отписаться

    const initState = initialState || makeBaseState();

    await this.steps.addAndRunStep({
      state: initState,
      onStart: async (state: BaseState): Promise<void> => {
        await onStart(state);
      },
      onEnd: async (state: BaseState): Promise<void> => {
        // TODO: почему это не делается в самом BreadCrumbs ?
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
        // TODO: почему это не делается в самом BreadCrumbs ?
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
