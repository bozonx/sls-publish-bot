import {PageList, Page} from 'better-telegraph';
import {compactUndefined} from '../../../../../../../../../mnt/disk2/workspace/squidlet-lib';
import TgChat from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/TgChat';
import {addSimpleStep} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/helpers';
import {TgReplyButton} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/TgReplyButton';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/buttons';
import {Pagination} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/Pagination';


export const TELEGRAPH_LIST_MENU = {
  NEXT: 'NEXT',
  PREV: 'PREV',
};

const PAGE_ITEM_CALLBACK = 'PAGE_ITEM_CALLBACK:'


export async function askTelegraphList(tgChat: TgChat, onDone: (page: Page) => void) {
  const pagination = new Pagination(
    tgChat.app.appConfig.itemsPerPage,
    async (pageSize: number, offset?: number) => {
      try {
        const pages: PageList = await tgChat.app.telegraPh.getPages(pageSize, offset)

        return {
          items: pages.pages,
          totalCount: pages.total_count
        }
      }
      catch (e) {
        await tgChat.reply(String(e))
      }
    },
    async (pages: Page[], hasNext: boolean, hasPrev: boolean, totalCount?: number) => {
      addSimpleStep(
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
                  callback_data: TELEGRAPH_LIST_MENU.PREV,
                } || undefined,
                hasNext && {
                  text: tgChat.app.i18n.commonPhrases.next,
                  callback_data: TELEGRAPH_LIST_MENU.NEXT,
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
          else if (queryData === TELEGRAPH_LIST_MENU.NEXT) {
            return pagination.goNext()
          }
          else if (queryData === TELEGRAPH_LIST_MENU.PREV) {
            return pagination.goPrev()
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
