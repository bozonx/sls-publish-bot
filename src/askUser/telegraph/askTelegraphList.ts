import {PageList, Page} from 'better-telegraph';
import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {compactUndefined} from '../../lib/arrays.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';
import {Pagination} from '../../helpers/Pagination.js';


export type TelegraphListMenu = 'TELEGRAPH_NEXT' | 'TELEGRAPH_PREV';

export const TELEGRAPH_LIST_MENU: Record<TelegraphListMenu, TelegraphListMenu> = {
  TELEGRAPH_NEXT: 'TELEGRAPH_NEXT',
  TELEGRAPH_PREV: 'TELEGRAPH_PREV',
};

const PAGE_ITEM_CALLBACK = 'PAGE_ITEM_CALLBACK:'


export async function askTelegraphList(tgChat: TgChat, onDone: (page: Page) => void) {
  const pagination = new Pagination(
    tgChat.app.appConfig.itemsPerPage,
    async (offset: number, pageSize: number) => {
      const pages: PageList = await tgChat.app.telegraPh.getPages(pageSize, offset)

      return [pages.pages, pages.total_count]
    },
    async (pages: Page[], hasNext: boolean, hasPrev: boolean, totalCount?: number) => {
      await addSimpleStep(
        tgChat,
        async (): Promise<[string, TgReplyButton[][]]> => {
          return [
            tgChat.app.i18n.menu.telegraphPageList + totalCount,
            [
              ...pages.map((page, index) => {
                return [{
                  text: `(${page.views}) ${page.title}`,
                  callback_data: PAGE_ITEM_CALLBACK + index,
                }]
              }),
              compactUndefined([
                hasPrev && {
                  text: tgChat.app.i18n.commonPhrases.prev,
                  callback_data: TELEGRAPH_LIST_MENU.TELEGRAPH_PREV,
                } || undefined,
                hasNext && {
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
        async (queryData: string) => {
          if (queryData.indexOf(PAGE_ITEM_CALLBACK) === 0) {
            const splat: string[] = queryData.split(':');
            const page: Page = pages[Number(splat[1])];

            onDone(page)
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          else if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
          else if (queryData === TELEGRAPH_LIST_MENU.TELEGRAPH_NEXT) {
            await pagination.goNext()
          }
          else if (queryData === TELEGRAPH_LIST_MENU.TELEGRAPH_PREV) {
            await pagination.goPrev()
          }
          // else if (Object.keys(TELEGRAPH_LIST_MENU).includes(queryData)) {
          //   onDone(queryData as TelegraphListMenu);
          // }
        }
      )
    }
  )

  await pagination.init()
}
