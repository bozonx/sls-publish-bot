import TgChat from '../../apiTg/TgChat.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';
import {Pagination} from '../../helpers/Pagination.js';


const ASK_CREATIVE_ITEM = {
  NEXT: 'NEXT',
}

const CONTENT_MARKER = 'content:'


export async function askCreative(blogName: string, tgChat: TgChat, onDone: (item: PageObjectResponse) => void) {
  const pagination = new Pagination(
    tgChat.app.appConfig.itemsPerPage,
    async (pageSize: number, offset?: number, nextCursor?: string | null) => {
      try {
        const result = await tgChat.app.notion.api.databases.query({
          database_id: tgChat.app.blogs[blogName].notion.creativeDbId,
          page_size: pageSize,
          start_cursor: nextCursor || undefined
        })

        return {
          items: result.results,
          nextCursor: result.next_cursor,
          hasNext: result.has_more,
        }
      }
      catch (e) {
        await tgChat.reply(tgChat.app.i18n.errors.errorLoadFromNotion + e)
        await tgChat.steps.back()

        return
      }
    },
    async (items: PageObjectResponse[], hasNext: boolean) => {
      await addSimpleStep(
        tgChat,
        async (): Promise<[string, TgReplyButton[][]]> => {
          return [
            tgChat.app.i18n.menu.selectCreatives,
            [
              ...items.map((item, index) => {
                return [{
                  text: (item as any).properties.name.title[0]?.plain_text,
                  callback_data: CONTENT_MARKER + index,
                }]
              }),
              (hasNext) ? [{
                text: tgChat.app.i18n.commonPhrases.next,
                callback_data: ASK_CREATIVE_ITEM.NEXT,
              }] : [],
              [
                makeBackBtn(tgChat.app.i18n),
                makeCancelBtn(tgChat.app.i18n),
              ],
            ]
          ]
        },
        (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back()
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel()
          }
          else if (queryData === ASK_CREATIVE_ITEM.NEXT) {
            return pagination.goNext()
          }
          else if (queryData.indexOf(CONTENT_MARKER) === 0) {
            const splat = queryData.split(':')
            const itemIndex = Number(splat[1])
            const item = items[itemIndex]

            onDone(item)
          }
          else {
            throw new Error(`Unknown action`)
          }
        }
      )
    }
  )

  await pagination.init()
}
