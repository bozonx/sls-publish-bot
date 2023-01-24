import {PageList} from 'better-telegraph';
import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {Page} from 'better-telegraph/src/types.js';


export type TelegraphListMenu = 'TELEGRAPH_NEXT' | 'TELEGRAPH_PREV';

export const TELEGRAPH_LIST_MENU: Record<TelegraphListMenu, TelegraphListMenu> = {
  TELEGRAPH_NEXT: 'TELEGRAPH_NEXT',
  TELEGRAPH_PREV: 'TELEGRAPH_PREV',
};

const PAGE_ITEM_CALLBACK = 'PAGE_ITEM_CALLBACK:'


export async function askTelegraphList(tgChat: TgChat, onDone: (page: Page) => void, offset = 0) {
  let pages: PageList;

  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      pages = await tgChat.app.telegraPh.getPages(tgChat.app.appConfig.itemsPerPage, offset)

      return [
        tgChat.app.i18n.menu.telegraphPageList + pages.total_count,
        [
          ...pages.pages.map((page, index) => {
            return [{
              text: page.title,
              callback_data: PAGE_ITEM_CALLBACK + index,
            }]
          }),
          [
            // TODO: проверить конец
            {
              text: tgChat.app.i18n.commonPhrases.prev,
              callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_PREV,
            },
            // TODO: проверить конец
            {
              text: tgChat.app.i18n.commonPhrases.next,
              callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_NEXT,
            },
          ],
          [
            CANCEL_BTN,
            BACK_BTN,
          ]
        ],
      ]
    },
    (queryData: string) => {
      if (queryData.indexOf(PAGE_ITEM_CALLBACK) === 0) {
        const splat: string[] = queryData.split(':');
        const page: Page = pages.pages[Number(splat[1])];

        onDone(page)
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel();
      }
      else if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back();
      }
      else if (queryData === TELEGRAPH_LIST_MENU.TELEGRAPH_NEXT) {
        // TODO: проверить конец
        askTelegraphList(tgChat, onDone, offset + tgChat.app.appConfig.itemsPerPage);
      }
      else if (queryData === TELEGRAPH_LIST_MENU.TELEGRAPH_PREV) {
        // TODO: проверить конец
        askTelegraphList(tgChat, onDone, offset - tgChat.app.appConfig.itemsPerPage);
      }
      // else if (Object.keys(TELEGRAPH_LIST_MENU).includes(queryData)) {
      //   onDone(queryData as TelegraphListMenu);
      // }
    }
  );
}
