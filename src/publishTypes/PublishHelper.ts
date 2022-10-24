import App from "../App";
import { ignorePromiseError } from "../lib/common";
import { AppEvents } from "../types/consts";
import NotionPage from "../notionApi/types/NotionPage";



export default class PublishHelper {
  public readonly app: App;
  private pageSelectMessageId: number = -1;


  constructor(app: App) {
    this.app = app;
  }


  async askPageToUse(channelId: number): Promise<NotionPage> {
    const eventMarker = 'selectedPage:';
    const rawPages = await this.app.notionRequest.getRawPageList();
    const result = await this.app.tg.bot.telegram.sendMessage(this.app.tg.botChatId, this.app.i18n.menu.selectPage, {
      reply_markup: {
        inline_keyboard: [
          rawPages.map((item, index) => {
            return {
              text: item.title,
              callback_data: eventMarker + index,
            }
          }),
        ]
      }
    });

    this.pageSelectMessageId = result.message_id;

    return new Promise((resolve, reject) => {
      const eventIindex = this.app.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
        if (queryData.indexOf(eventMarker) === 0) {
          const splat: string[] = queryData.split(':');
          const notionPage = rawPages[Number(splat[1])];
  
          this.app.events.removeListener(eventIindex);
  
          ignorePromiseError(this.app.tg.ctx.deleteMessage(this.pageSelectMessageId));
          this.app.tg.bot.telegram.sendMessage(
            this.app.tg.botChatId,
            this.app.i18n.menu.selectedRawPage + notionPage.title
          )
            .then(() => resolve(notionPage))
            .catch(reject);
        }
  
        // TODO: add timeout
        // TODO: add cancelation
      });
    });
  }
}
