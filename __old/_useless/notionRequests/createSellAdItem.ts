import {registerTgPost} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/registerTgPost';
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints.js';
import {AD_FORMATS, AD_SELL_TYPES, MediaGroupItem} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/types';
import TgChat from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/TgChat';
import {TgReplyBtnUrl} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/TgReplyButton';
import {addHorsInDate, makeIsoDateTimeStr} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/helpers';
import {convertHtmlToNotionRichText} from '../helpers/convertHtmlToNotionRichText';


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
        type: 'title',
        title: convertHtmlToNotionRichText(buyerHtml),
      } || (undefined as any),
      contact: contactHtml && {
        type: 'rich_text',
        rich_text: convertHtmlToNotionRichText(contactHtml),
      } || (undefined as any),
      priceRub: (typeof cost !== 'undefined') ? {
        type: 'number',
        number: cost,
      } : (undefined as any),
      note: note && {
        type: 'rich_text',
        rich_text: convertHtmlToNotionRichText(note),

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
