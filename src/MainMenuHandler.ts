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


const CHANNEL_MARKER = 'channel:';


export default class MainMenuHandler {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
  }


  async startFromBeginning() {
    await this.askChannel();

    // const channelId: number = await this.askChannel();
    // // if not channel selected - do nothing
    // if (channelId === -1) return;
    //
    // // else go work with channel
    // const selectedType: string = await this.askPublishType(channelId);
    //
    // await this.startMakingRecord(channelId, selectedType);
  }


  private async askChannel() {
    const state = {};
    let messageId = -1;
    let handlerIndex = -1;

    const stepNum = await this.tgChat.steps.addAndRunStep({
      onStart: async (state: Record<string, any>): Promise<void> => {
        // print main menu message
        messageId = await this.printMainMenuMessage();
        // listen to result
        handlerIndex = this.tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
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
            //this.tgChat.events.removeListener(handlerIndex);

            const splat: string[] = queryData.split(':');
            const channelId: number = Number(splat[1]);
            // save state
            state.channelId = channelId;
            // don't wait of removing the asking message
            ignorePromiseError(this.tgChat.deleteMessage(messageId));
            // print result
            await this.tgChat.reply(
              this.tgChat.app.i18n.menu.selectedChannel
              + this.tgChat.app.config.channels[channelId].dispname
            );

            // TODO: как сообщить что этот этап закончился и нужно запустить другой ???
          }
          else {
            // else do nothing
            return;
          }
        });
      },
      onEnd: async (state: Record<string, any>): Promise<void> => {
        this.tgChat.events.removeListener(handlerIndex);
      },
      onCancel: async (state: Record<string, any>): Promise<void> => {
        this.tgChat.events.removeListener(handlerIndex);
      },
      state,
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


  private async askPublishType(channelId: number) {
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.whatToDo,
      {
        reply_markup: {
          inline_keyboard: [
            this.app.config.channels[channelId].supportedTypes.map((type: number) => {
              switch (type) {
                case PublicationTypes.Article:
                  return {
                    text: this.app.i18n.menu.btnCreateArticle,
                    callback_data: MENU_MAKE_ARTICLE,
                  }
                case PublicationTypes.Post1000:
                  return {
                    text: this.app.i18n.menu.btnCreatePost1000,
                    callback_data: MENU_MAKE_POST1000,
                  }
                case PublicationTypes.Story:
                  return {
                    text: this.app.i18n.menu.btnCreateStory,
                    callback_data: MENU_MAKE_STORY,
                  }
                default:
                  throw new Error(`Unsupported publication type`)
              }
            }),
          ]
        }
      }
    );

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
