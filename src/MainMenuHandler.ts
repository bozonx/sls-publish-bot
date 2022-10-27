import { ignorePromiseError } from "./lib/common";
import PublishArticle from "./publishTypes/PublishArticle";
import PublishPost1000 from "./publishTypes/PublishPost1000";
import PublishStory from "./publishTypes/PublishStory";
import {
  AppEvents,
  MENU_MAKE_ARTICLE,
  MENU_MAKE_POST1000,
  MENU_MAKE_STORY,
  MENU_MANAGE_SITE, PublicationTypes
} from "./types/consts";
import {waitEvent} from "./lib/waitEvent";
import TgChat from './tgApi/TgChat';
import BaseState from './types/BaseState';
import {makeBaseState} from './helpers/helpers';


const CHANNEL_MARKER = 'channel:';


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await this.askChannel();
  }


  private async askChannel() {
    await this.tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
      // print main menu message
      state.messageId = await this.printMainMenuMessage();
      // listen to result
      state.handlerIndex = this.tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
        if (queryData === MENU_MANAGE_SITE) {
          //this.tgChat.events.removeListener(handlerIndex);
          // ignorePromiseError(this.tgChat.deleteMessage(messageId));
          // //await this.tgChat.reply(this.tgChat.app.i18n.menu.selectedSlsSite);
          //
          // // TODO: do it !!!!
          // console.log(11111, '!!!! manage site')
          return;
        }
        else if (queryData.indexOf(CHANNEL_MARKER) === 0) {
          this.handleMainMenuSelected(queryData, state)
            .catch((e) => {throw e})
        }
        // else do nothing
      });
    });
  }

  private async printMainMenuMessage(): Promise<number> {
    return this.tgChat.reply(this.tgChat.app.i18n.menu.selectChannel, [
      ...this.tgChat.app.config.channels.map((item, index: number): any => {
        return {
          text: item.dispname,
          callback_data: CHANNEL_MARKER + index,
        };
      }),
      {
        text: this.tgChat.app.i18n.menu.selectManageSite,
        callback_data: MENU_MANAGE_SITE,
      }
    ]);
  }

  private async handleMainMenuSelected(queryData: string, state: BaseState) {
    const splat: string[] = queryData.split(':');
    const channelId: number = Number(splat[1]);

    // save state
    //state.channelId = channelId;


    // print result
    await this.tgChat.reply(
      this.tgChat.app.i18n.menu.selectedChannel
      + this.tgChat.app.config.channels[channelId].dispname
    );

    await this.askPublishType(channelId);
    //
    // await this.startMakingRecord(channelId, selectedType);
    // TODO: перейти к новому этапу
  }


  private async askPublishType(channelId: number) {
    const state: BaseState = {
      messageId: -1,
      handlerIndex: -1,
    };

    await this.tgChat.steps.addAndRunStep({
      onStart: async (state: Record<string, any>): Promise<void> => {
        // print ask type message
        state.messageId = await this.printAskTypeMessage();
      },
      onEnd: async(state: Record<string, any>): Promise<void> => {
      },
      onCancel: async(state: Record<string, any>): Promise<void> => {
      },
      state
    });

    const selectedResult: string = await waitEvent(this.app.events, AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if ([
        MENU_MAKE_ARTICLE,
        MENU_MAKE_POST1000,
        MENU_MAKE_STORY
      ].includes(queryData)) return true;
    });

    ignorePromiseError(this.app.tg.ctx.deleteMessage(messageResult.message_id));
    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedType + selectedResult
    );

    return selectedResult;
  }

  private async printAskTypeMessage(channelId: number): Promise<number> {
    return this.tgChat.reply(
      this.tgChat.app.i18n.menu.whatToDo,
      this.tgChat.app.config.channels[channelId].supportedTypes.map((type: number) => {
        switch (type) {
          case PublicationTypes.Article:
            return {
              text: this.tgChat.app.i18n.menu.btnCreateArticle,
              callback_data: MENU_MAKE_ARTICLE,
            }
          case PublicationTypes.Post1000:
            return {
              text: this.tgChat.app.i18n.menu.btnCreatePost1000,
              callback_data: MENU_MAKE_POST1000,
            }
          case PublicationTypes.Story:
            return {
              text: this.tgChat.app.i18n.menu.btnCreateStory,
              callback_data: MENU_MAKE_STORY,
            }
          default:
            throw new Error(`Unsupported publication type`)
        }
      })
    );
  }

  private async startMakingRecord(channelId: number, selectedType: string) {
    switch (selectedType) {
      case MENU_MAKE_ARTICLE:
        const article = new PublishArticle(this.app);

        await article.start(channelId);
        break;

      case MENU_MAKE_POST1000:
        const post1000 = new PublishPost1000(this.app);

        await post1000.start(channelId);
        break;

      case MENU_MAKE_STORY:
        const story = new PublishStory(this.app);

        await story.start(channelId);
        break;

      default:
        break;
    }
  }
}
