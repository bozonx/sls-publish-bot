import App from "../App";
import { ignorePromiseError } from "../lib/common";
import {AppEvents, MENU_MANAGE_SITE} from "../types/consts";
import {waitEvent} from '../lib/waitEvent';
import NotionListItem from '../notionApi/types/NotionListItem';



export default class PublishHelper {
  public readonly app: App;


  constructor(app: App) {
    this.app = app;
  }


  /**
   * Ask user to select raw page to use
   * @param channelId
   */
  async askPageToUse(channelId: number): Promise<NotionListItem> {
    const eventMarker = 'selectedPage:';
    const rawPages = await this.app.notionRequest.getDbList(
      this.app.config.channels[channelId].notionRawPagesDbId
    );
    const messageResult = await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectPage,
      {
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
      }
    );

    const selectedResult: string = await waitEvent(this.app.events, AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData.indexOf(eventMarker) === 0) return true;
    });
    const splat: string[] = selectedResult.split(':');
    const pageIndex = Number(splat[1])
    const selectedItem: NotionListItem = rawPages[pageIndex];

    ignorePromiseError(this.app.tg.ctx.deleteMessage(messageResult.message_id));

    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedRawPage + selectedItem.title
    );

    return selectedItem;
  }
}
