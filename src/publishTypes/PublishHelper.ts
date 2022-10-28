import { ignorePromiseError } from "../lib/common";
import {AppEvents, MENU_NEW_RAW_PAGE} from "../types/consts";
import {waitEvent} from '../lib/waitEvent';
import NotionListItem from '../notionApi/types/NotionListItem';
import TgChat from '../tgApi/TgChat';


export default class PublishHelper {
  public readonly tgChat: TgChat;


  constructor(tgChat: TgChat) {
    this.tgChat = tgChat;
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
            [
              {
                text: this.app.i18n.menu.btnNewPage,
                callback_data: MENU_NEW_RAW_PAGE,
              },
              ...rawPages.map((item, index) => {
                return {
                  text: item.title,
                  callback_data: eventMarker + index,
                }
              })
            ],
          ]
        }
      }
    );

    const selectedResult: string = await waitEvent(this.app.events, AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData === MENU_NEW_RAW_PAGE || queryData.indexOf(eventMarker) === 0) return true;
    });

    ignorePromiseError(this.app.tg.ctx.deleteMessage(messageResult.message_id));

    if (selectedResult === MENU_NEW_RAW_PAGE) {

      // TODO: !!!!

      throw new Error('UNDER CONSTRUCTION!!!')
    }

    const splat: string[] = selectedResult.split(':');
    const pageIndex = Number(splat[1])
    const selectedItem: NotionListItem = rawPages[pageIndex];

    await this.app.tg.bot.telegram.sendMessage(
      this.app.tg.botChatId,
      this.app.i18n.menu.selectedRawPage + selectedItem.title
    );

    return selectedItem;
  }
}
