import App from "./App";
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


export default class MainMenuHandler {
  public readonly app: App;
  //private startMessageId: number = -1;
  //private channelMessageId: number = -1;


  constructor(app: App) {
    this.app = app;
  }


  async startFromBeginning() {
    const channelId: number = await this.askChannel();
    // if not channel selected - do nothing
    if (channelId === -1) return;

    // else go work with channel
    const selectedType: string = await this.askPublishType(channelId);

    await this.startMakingRecord(channelId, selectedType);
  }


  private async askChannel(): Promise<number> {
    const eventMarker = 'channel:';
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectChannel,
      {
        reply_markup: {
          inline_keyboard: [
            [
              ...this.app.config.channels.map((item, index: number): any => {
                return {
                  text: item.dispname,
                  callback_data: eventMarker + index,
                };
              }),
              {
                text: this.app.i18n.menu.selectManageSite,
                callback_data: MENU_MANAGE_SITE,
              }
            ],
          ]
        }
      }
    );

    const selectedResult: string = await waitEvent(this.app.events, AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData === MENU_MANAGE_SITE || queryData.indexOf(eventMarker) === 0) return true;
    });

    if (selectedResult === MENU_MANAGE_SITE) {
      ignorePromiseError(this.app.tg.ctx.deleteMessage(messageResult.message_id));
      await this.app.tg.bot.telegram.sendMessage(
        this.app.tg.botChatId,
        this.app.i18n.menu.selectedSlsSite
      );

      // TODO: do it !!!!
      console.log(11111, '!!!! manage site')
      return -1;
    }
    // else
    const splat: string[] = selectedResult.split(':');
    const channelId: number = Number(splat[1]);

    ignorePromiseError(this.app.tg.ctx.deleteMessage(messageResult.message_id));
    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedChannel + this.app.config.channels[channelId].dispname
    );

    return channelId;
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
