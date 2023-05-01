import {IndexedEventEmitter} from 'squidlet-lib';
import App from '../App.js';
import BreadCrumbs from '../helpers/BreadCrumbs.js';
import {ChatEvents} from '../types/constants.js';
import {TgReplyButton} from '../types/TgReplyButton.js';
import BaseState from '../types/BaseState.js';
import {makeBaseState} from '../helpers/helpers.js';
import BotChatLog from '../helpers/BotChatLog.js';
import {
  PhotoMessageEvent,
  PollMessageEvent,
  TextMessageEvent,
  VideoMessageEvent
} from '../types/MessageEvent.js';
import {TelegramMenuRenderer} from './TelegramMenuRenderer.js';
import {MenuItem} from '../types/MenuItem.js';
import {MenuDefinition} from '../menuManager/MenuManager.js';


export default class TgChat {
  public readonly app: App;
  //readonly tgChatMenu: TgChatMenu
  public readonly menu: TelegramMenuRenderer
  public readonly events: IndexedEventEmitter;
  // chat id where was start function called
  public readonly botChatId: number | string;
  //public readonly steps: BreadCrumbs;
  public readonly log: BotChatLog;


  constructor(chatId: number | string, app: App) {
    this.botChatId = chatId;
    this.app = app;
    this.menu = new TelegramMenuRenderer(this)
    // this.steps = new BreadCrumbs(async () => {
    //   await topLevelMenuStarter(this);
    // });
    this.events = new IndexedEventEmitter();
    this.log = new BotChatLog(this.app.appConfig.botChatLogLevel, this);
  }

  async destroy() {
    await this.menu.destroy();
    this.events.destroy();
  }


  async startCmd() {
    // TODO: оно тут разве должно быть???
    const greet: MenuDefinition = {
      path: '',
      messageHtml: 'Hello!!!'
    }
    // Start from very beginning and cancel current state if need.
    await this.menu.init(greet);
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

    try {
      this.events.emit(ChatEvents.CALLBACK_QUERY, queryData);
    }
    catch (e) {
      this.app.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    }
  }

  handleIncomeTextEvent(msgEvent: TextMessageEvent) {
    try {
      this.events.emit(ChatEvents.TEXT, msgEvent);
    }
    catch (e) {
      this.app.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    }
  }

  handleIncomePhotoEvent(msgEvent: PhotoMessageEvent) {
    try {
      this.events.emit(ChatEvents.PHOTO, msgEvent);
    }
    catch (e) {
      this.app.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    }
  }

  handleIncomeVideoEvent(msgEvent: VideoMessageEvent) {
    try {
      this.events.emit(ChatEvents.VIDEO, msgEvent);
    }
    catch (e) {
      this.app.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    }
  }

  // handleIncomeMediaGroupItemEvent(msgEvent: MediaGroupItemMessageEvent) {
  //   this.events.emit(ChatEvents.MEDIA_GROUP_ITEM, msgEvent);
  // }

  handleIncomePollEvent(msgEvent: PollMessageEvent) {
    try {
      this.events.emit(ChatEvents.POLL, msgEvent);
    }
    catch (e) {
      this.app.consoleLog.warn(`An error was caught on events.emit in TgChan: ${e}`)
    }
  }

  async reply(
    message: string,
    buttons?: TgReplyButton[][],
    disablePreview = false,
    html = false
  ): Promise<number> {
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.botChatId,
      message,
      {
        parse_mode: (html) ? this.app.appConfig.telegram.parseMode : undefined,
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

  // async addOrdinaryStep(
  //   onStart: (state: BaseState) => Promise<void>,
  //   initialState?: BaseState,
  //   stepName?: string
  // ) {
  //   const initState = initialState || makeBaseState();
  //
  //   await this.steps.addAndRunStep({
  //     name: stepName,
  //     state: initState,
  //     onStart: async (state: BaseState): Promise<void> => onStart(state),
  //     // go to the new one step normally
  //     onEnd: async (state: BaseState): Promise<void> => {
  //       for (const item of state.handlerIndexes) {
  //         this.events.removeListener(item[0], item[1])
  //       }
  //       // don't wait of removing the asking message
  //       for (const messageId of state.messageIds) {
  //         this.deleteMessage(messageId)
  //           .catch((e) => this.app.consoleLog.warn(`Can't delete menu message onEnd: ${e}`));
  //       }
  //
  //       state.handlerIndexes.splice(0)
  //       state.messageIds.splice(0)
  //     },
  //     // go back to one or more steps
  //     onCancel: async (state: BaseState): Promise<void> => {
  //       for (const item of state.handlerIndexes) {
  //         this.events.removeListener(item[0], item[1]);
  //       }
  //       // don't wait of removing the asking message
  //       for (const messageId of state.messageIds) {
  //         this.deleteMessage(messageId)
  //           .catch((e) => this.app.consoleLog.warn(`Can't delete menu message onCancel: ${e}`));
  //       }
  //
  //       state.handlerIndexes.splice(0)
  //       state.messageIds.splice(0)
  //     },
  //   });
  // }

}
