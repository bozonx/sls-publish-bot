import App from "./App";
import { ignorePromiseError } from "./lib/common";
import { AppEvents, MENU_MAKE_ARTICLE, MENU_MAKE_POST1000, MENU_MAKE_STORY } from "./types/consts";



export default class MainMenuHandler {
  public readonly app: App;
  private startMessageId: number = -1;
  private channelMessageId: number = -1;
  private pageSelectMessageId: number = -1;


  constructor(app: App) {
    this.app = app;

    this.app.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if ([MENU_MAKE_ARTICLE, MENU_MAKE_POST1000, MENU_MAKE_STORY].includes(queryData)) {
        this.askChannel(queryData).catch((e) => { throw e });
      }
      else if (queryData.indexOf('channel:') === 0) {
        const splat: string[] = queryData.split(':');

        this.askPageToUse(Number(splat[1]), splat[2]).catch((e) => { throw e });
      }
      else if (queryData.indexOf('selectedPage:') === 0) {
        const splat: string[] = queryData.split(':');

        this.startMakingMaterial(Number(splat[1]), splat[2], splat[3]).catch((e) => { throw e });
      }
    });
  }



  async askPublishType() {
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


  private async askChannel(selection: string | undefined) {
    ignorePromiseError(this.app.tg.ctx.deleteMessage(this.startMessageId));

    const result = await this.app.tg.bot.telegram.sendMessage(this.app.tg.botChatId, this.app.i18n.menu.selectChannel, {
      reply_markup: {
        inline_keyboard: [
          this.app.config.channels.map((item, index: number): any => {
            return {
              text: item.dispname,
              callback_data: `channel:${index}:${selection}`,
            };
          }),
        ]
      }
    });

    this.channelMessageId = result.message_id;
  }

  private async askPageToUse(channelId: number, menuAction: string) {
    ignorePromiseError(this.app.tg.ctx.deleteMessage(this.channelMessageId));

    const rawPages = await this.app.notionRequest.getRawPageList();
    const result = await this.app.tg.bot.telegram.sendMessage(this.app.tg.botChatId, this.app.i18n.menu.selectPage, {
      reply_markup: {
        inline_keyboard: [
          rawPages.map((item) => {
            return {
              text: item.caption,
              callback_data: `selectedPage:${channelId}:${menuAction}:${item.pageId}`,
            }
          }),
        ]
      }
    });

    this.pageSelectMessageId = result.message_id;
  }

  private async startMakingMaterial(channelId: number, menuAction: string, pageId: string) {
    ignorePromiseError(this.app.tg.ctx.deleteMessage(this.pageSelectMessageId));

    console.log(1111, channelId, menuAction, pageId)
  }
}
