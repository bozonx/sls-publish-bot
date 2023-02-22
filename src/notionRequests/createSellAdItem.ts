import {registerTgPost} from '../publish/registerTgPost.js';
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints.js';
import {AD_FORMATS, AD_SELL_TYPES, MediaGroupItem} from '../types/types.js';
import TgChat from '../apiTg/TgChat.js';
import {TgReplyBtnUrl} from '../types/TgReplyButton.js';


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
  cost?: number,
  note?: string
) {
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
      autoDeleteTgIsoDateTime
    )
  }
  catch (e) {
    await tgChat.reply(String(e))

    return
  }

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
      ad_type: {
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

      //is_collab: { id: 'jh%3Dp', name: 'is_collab', type: 'checkbox', checkbox: {} },

    },
  };

  if (typeof cost !== 'undefined') {
    request.properties.price_rub = {
      type: 'number',
      number: cost,
    };
  }

  if (note) {
    request.properties.note = {
      type: 'title',
      title: [{
        text: {
          content: note,
        },
      }],
    };
  }

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
