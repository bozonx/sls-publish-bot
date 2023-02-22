import TgChat from '../../apiTg/TgChat.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';


const CONTENT_MARKER = 'content:'


export async function askCreative(blogName: string, tgChat: TgChat, onDone: (item: PageObjectResponse) => void) {
  let items: PageObjectResponse[]

  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      try {
        items = (await tgChat.app.notion.api.databases.query({
          database_id: tgChat.app.blogs[blogName].notion.creativeDbId,
          // TODO: сделать пагинацию
          page_size: 10,
        })).results as any;
      }
      catch (e) {
        return [
          tgChat.app.i18n.errors.errorLoadFromNotion + e,
          []
        ]
      }

      return [
        tgChat.app.i18n.menu.selectCreatives,
        [
          ...items.map((item, index) => {
            return [{
              text: (item as any).properties.name.title[0]?.plain_text,
              callback_data: CONTENT_MARKER + index,
            }]
          }),
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
