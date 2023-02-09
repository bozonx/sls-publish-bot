import {PageList} from 'better-telegraph';
import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {Page} from 'better-telegraph/src/types.js';
import {compactUndefined} from '../../lib/arrays.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';


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
              text: `(${page.views}) ${page.title}`,
              callback_data: PAGE_ITEM_CALLBACK + index,
            }]
          }),
          compactUndefined([
            offset > tgChat.app.appConfig.itemsPerPage -1 && {
              text: tgChat.app.i18n.commonPhrases.prev,
              callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_PREV,
            } || undefined,
            pages.pages.length === tgChat.app.appConfig.itemsPerPage && {
              text: tgChat.app.i18n.commonPhrases.next,
              callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_NEXT,
            } || undefined,
          ]),
          [
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n),
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
