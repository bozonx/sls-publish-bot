import moment from 'moment/moment.js';
import {registerTgPost} from '../publish/registerTgPost.js';
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints.js';
import {AD_FORMATS, AD_SELL_TYPES, MediaGroupItem} from '../types/types.js';
import TgChat from '../apiTg/TgChat.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';
import {addHorsInDate, makeIsoDateTimeStr} from '../helpers/helpers.js';
import {WARN_SIGN} from '../types/constants.js';


export async function createSellAdItem(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  usePreview: boolean,
  mediaGroup: MediaGroupItem[],
  resultTextHtml: string,
  format: keyof typeof AD_FORMATS,
  adType: keyof typeof AD_SELL_TYPES,
  tgUrlBtn?: TgReplyBtnUrl,
  autoDeleteTgIsoDateTime?: string,
  autoDeletePeriodHours?: number,
  cost?: number,
  note?: string,
  contactHtml?: string,
  buyerHtml?: string
) {
  let resolvedAutoDeleteTime = autoDeleteTgIsoDateTime

  if (autoDeletePeriodHours) {
    resolvedAutoDeleteTime = addHorsInDate(
      makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset),
      autoDeletePeriodHours
    )
  }

  try {
    await registerTgPost(
      blogName,
      tgChat,
      isoDate,
      time,
      resultTextHtml,
      !mediaGroup.length,
      usePreview,
      mediaGroup,
      tgUrlBtn,
      resolvedAutoDeleteTime
    )
  }
  catch (e) {
    await tgChat.reply(String(e))

    return
  }

  // TODO: note - преобразовать html в notion
  // TODO: contactHtml - преобразовать html в notion
  // TODO: buyerHtml - преобразовать html в notion

  const request: CreatePageParameters = {
    parent: { database_id: tgChat.app.blogs[blogName].notion.sellTgDbId },
    properties: {
      date: {
        type: 'date',
        date: {
          start: isoDate
        },
      },
      time: {
        type: 'rich_text',
        rich_text: [{
          type: 'text',
          text: {
            content: time
          },
        }],
      },
      adType: {
        type: 'select',
        select: {
          name: adType,
        }
      },
      format: {
        type: 'select',
        select: {
          name: format,
        }
      },
      buyer: buyerHtml && {
        type: 'rich_text',
        rich_text: [{
          type: 'text',
          text: {
            content: buyerHtml
          },
        }],
      } || (undefined as any),
      contact: contactHtml && {
        type: 'rich_text',
        rich_text: [{
          type: 'text',
          text: {
            content: contactHtml
          },
        }],
      } || (undefined as any),
      priceRub: (typeof cost !== 'undefined') ? {
        type: 'number',
        number: cost,
      } : (undefined as any),
      note: note && {
        type: 'title',
        title: [{
          text: {
            content: note,
          },
        }],
      } || (undefined as any),

      //is_collab: { id: 'jh%3Dp', name: 'is_collab', type: 'checkbox', checkbox: {} },

    },
  };

  const result = await tgChat.app.notion.api.pages.create(request)

  if (!result.id) throw new Error(`No result id`)
}



// const SELL_AD_TYPE_IDS: Record<keyof typeof AD_SELL_TYPES, string> = {
//   publish_post: 'nbiD',
//   recommend: 'dgBa',
//   other: 'a=W|',
// };

// const SELL_AD_FORMAT_IDS: Record<keyof typeof AD_FORMATS, string> = {
//   '1/24': 'UkwQ',
//   '1/48': 'QkT=',
//   '2/24': 'kXXI',
//   '2/48': 'z=|H',
//   '2/72': 'w}Ib',
//   '3/24': 'aajz',
//   '3/48': 'q]j}',
//   '3/72': 'FVNf',
//   'full/24': '@vMb',
//   'full/48': 'IEWl',
//   'full/72': 'ccLt',
//   forever: 'Jw}Z',
// };
