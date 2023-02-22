import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {PRINT_SHORT_DATE_FORMAT} from '../../types/constants.js';
import {PageObjectResponse, RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {CONTENT_PROPS} from '../../types/ContentItem.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';
import {Pagination} from '../../helpers/Pagination.js';
import {requestNotPublishedFromContentPlan} from '../../contentPlan/requestNotPublishedFromContentPlan.js';
import {compactUndefined} from '../../lib/arrays.js';


const ASK_CONTENT_ITEM = {
  NEXT: 'NEXT',
}

const CONTENT_MARKER = 'CONTENT_MARKER:'


export async function askContentToUse(
  blogName: string,
  tgChat: TgChat,
  onDone: (item: PageObjectResponse) => void
) {
  const pagination = new Pagination(
    tgChat.app.appConfig.itemsPerPage,
    async (pageSize: number, offset?: number, nextCursor?: string | null) => {
      try {
        // load not published records from content plan
        const result = await requestNotPublishedFromContentPlan(
          blogName,
          tgChat,
          pageSize,
          nextCursor!
        )

        return {
          items: result.items,
          nextCursor: result.nextCursor,
          hasNext: result.hasMore,
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
        () => [
          tgChat.app.i18n.menu.selectContent,
          [
            ...items.map((item, index) => {
              return [{
                text: makeButtonTitle(item),
                callback_data: CONTENT_MARKER + index,
              }];
            }),
            compactUndefined([
              hasNext && {
                text: tgChat.app.i18n.commonPhrases.next,
                callback_data: ASK_CONTENT_ITEM.NEXT,
              } || undefined,
            ]),
            [
              makeBackBtn(tgChat.app.i18n),
              makeCancelBtn(tgChat.app.i18n),
            ],
          ]
        ],
        (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back()
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel()
          }
          else if (queryData === ASK_CONTENT_ITEM.NEXT) {
            return pagination.goNext()
          }
          else if (queryData.indexOf(CONTENT_MARKER) === 0) {
            const splat = queryData.split(':')
            const itemIndex = Number(splat[1])

            onDone(items[itemIndex])
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


function makeButtonTitle(item: PageObjectResponse): string {
  const dateProp = item.properties[CONTENT_PROPS.date]
  const dateText: string = (dateProp as any).date.start
  const shortDateText: string = moment(dateText).format(PRINT_SHORT_DATE_FORMAT)
  const nameProp = item.properties[CONTENT_PROPS.nameGist]

  const gistRichText: RichTextItemResponse = (nameProp as any).title[0]

  return `${shortDateText} ${gistRichText?.plain_text || 'No name!'}`
}
