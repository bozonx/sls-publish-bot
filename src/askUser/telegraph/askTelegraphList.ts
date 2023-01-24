import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';


export type TelegraphListMenu = 'TELEGRAPH_NEXT' | 'TELEGRAPH_PREV';

export const TELEGRAPH_LIST_MENU: Record<TelegraphListMenu, TelegraphListMenu> = {
  TELEGRAPH_NEXT: 'TELEGRAPH_NEXT',
  TELEGRAPH_PREV: 'TELEGRAPH_PREV',
};

const PAGE_ITEM_CALLBACK = 'PAGE_ITEM_CALLBACK:'


export async function askTelegraphList(tgChat: TgChat, onDone: (action: TelegraphListMenu) => void) {
  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      const pages = await tgChat.app.telegraPh.getPages(4, 0)

      console.log(111, pages)

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
            {
              text: tgChat.app.i18n.commonPhrases.next,
              callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_NEXT,
            },
            {
              text: tgChat.app.i18n.commonPhrases.prev,
              callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_PREV,
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
      switch (queryData) {
        case CANCEL_BTN_CALLBACK:
          return tgChat.steps.cancel();
        case BACK_BTN_CALLBACK:
          return tgChat.steps.cancel();
        // case TELEGRAPH_MENU.TELEGRAPH_LIST:
        //   return onDone(TELEGRAPH_MENU.TELEGRAPH_LIST);
        default:
          throw new Error(`Unknown action`);
      }
    }
  );
}
