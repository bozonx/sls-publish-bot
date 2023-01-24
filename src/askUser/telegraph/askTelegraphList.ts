import {PageList} from 'better-telegraph';
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
  let pages: PageList;

  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      pages = await tgChat.app.telegraPh.getPages(4, 0)

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
      if (queryData.indexOf(PAGE_ITEM_CALLBACK) === 0) {
        const splat: string[] = queryData.split(':');
        const page = pages.pages[Number(splat[1])];

        console.log(222222, page)
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel();
      }
      else if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back();
      }
      else if (Object.keys(TELEGRAPH_LIST_MENU).includes(queryData)) {
        onDone(queryData as TelegraphListMenu);
      }
    }
  );
}
