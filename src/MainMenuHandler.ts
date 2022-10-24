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
  MENU_MANAGE_SITE
} from "./types/consts";
import {waitEvent} from "./lib/waitEvent";


export default class MainMenuHandler {
  public readonly app: App;
  //private startMessageId: number = -1;
  //private channelMessageId: number = -1;


  constructor(app: App) {
    this.app = app;

    this.app.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData.indexOf('channel:') === 0) {
        const splat: string[] = queryData.split(':');

        this.startMakingMaterial(Number(splat[1]), splat[2]).catch((e) => { throw e });
      }
      else if (queryData === MENU_MANAGE_SITE) {
        // TODO: add
      }
      else if ([MENU_MAKE_ARTICLE, MENU_MAKE_POST1000, MENU_MAKE_STORY].includes(queryData)) {
        // TODO: add
        //.catch((e) => { throw e });
      }

    });
  }


  async startFromBeginning() {
    await this.askChannel();

  }


  private async askChannel() {
    const messageResult = await this.app.tg.bot.telegram.sendMessage(this.app.tg.botChatId, this.app.i18n.menu.selectChannel, {
      reply_markup: {
        inline_keyboard: [
          [
            ...this.app.config.channels.map((item, index: number): any => {
              return {
                text: item.dispname,
                callback_data: `channel:${index}`,
              };
            }),
            {
              text: this.app.i18n.menu.selectManageSite,
              callback_data: MENU_MANAGE_SITE,
            }
          ],
        ]
      }
    });

    const selectedResult: string = await waitEvent(this.app.events, AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData.indexOf('channel:') === 0) return true;
    });

    const splat: string[] = selectedResult.split(':');

    ignorePromiseError(this.app.tg.ctx.deleteMessage(messageResult.message_id));
    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedType + menuAction
    );

    return splat[1];
  }

  private async askPublishType() {
    const result = await this.app.tg.bot.telegram.sendMessage(this.app.tg.botChatId, this.app.i18n.menu.whatToDo, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: this.app.i18n.menu.btnCreateArticle,
              callback_data: MENU_MAKE_ARTICLE,
            },
            {
              text: this.app.i18n.menu.btnCreatePost1000,
              callback_data: MENU_MAKE_POST1000,
            },
            {
              text: this.app.i18n.menu.btnCreateStory,
              callback_data: MENU_MAKE_STORY,
            },
          ],
        ]
      }
    });

    this.startMessageId = result.message_id;
  }

  private async startMakingMaterial(channelId: number, menuAction: string) {
    ignorePromiseError(this.app.tg.ctx.deleteMessage(this.channelMessageId));
    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedChannel + this.app.config.channels[channelId].dispname
    );

    switch (menuAction) {
      case MENU_MAKE_ARTICLE:
        const article = new PublishArticle(this.app);

        await article.start(channelId, menuAction);
        break;

      case MENU_MAKE_POST1000:
        const post1000 = new PublishPost1000(this.app);

        await post1000.start(channelId, menuAction);
        break;

      case MENU_MAKE_STORY:
        const story = new PublishStory(this.app);

        await story.start(channelId, menuAction);
        break;
    
      default:
        break;
    }
  }
}
