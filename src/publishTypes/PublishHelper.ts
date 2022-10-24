import App from "../App";
import { AppEvents } from "../types/consts";



export default class PublishHelper {
  public readonly app: App;
  private pageSelectMessageId: number = -1;


  constructor(app: App) {
    this.app = app;

    this.app.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData.indexOf('selectedPage:') === 0) {
        const splat: string[] = queryData.split(':');

        //this.askPageToUse(Number(splat[1]), splat[2]).catch((e) => { throw e });
        //this.startMakingMaterial(Number(splat[1]), splat[2], splat[3]).catch((e) => { throw e });
      }
    });
  }


  async askPageToUse(channelId: number, menuAction: string) {
    ignorePromiseError(this.app.tg.ctx.deleteMessage(this.channelMessageId));
    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedType + this.app.config.channels[channelId].dispname
    );

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
}