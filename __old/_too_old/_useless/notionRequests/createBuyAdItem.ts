import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints.js';
import TgChat from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/TgChat';
import {AD_BUY_TYPES, AD_FORMATS} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/types';
import {convertHtmlToNotionRichText} from '../helpers/convertHtmlToNotionRichText';


export async function createBuyAdItem(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  adType: keyof typeof AD_BUY_TYPES,
  format: keyof typeof AD_FORMATS,
  channelName?: string,
  channelUrl?: string,
  cost?: number,
  note?: string,
) {

  // TODO: note - преобразовать html в notion

  const request: CreatePageParameters = {
    parent: { database_id: tgChat.app.blogs[blogName].notion.buyTgDbId },
    properties: {
      date: {
        type: 'date',
        date: {
          start: isoDate,
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
      channel: (channelName) ? {
        type: 'title',
        title: [{
          type: 'text',
          text: {
            content: channelName,
            link: (channelUrl) ? { url: channelUrl } : undefined,
          },
        }],
      } : (undefined as any),
      priceRub: (typeof cost !== 'undefined') ? {
        type: 'number',
        number: cost,
      } : (undefined as any),
      note: note && {
        type: 'rich_text',
        rich_text: convertHtmlToNotionRichText(note),
      } || (undefined as any),
    },
  }

  const result = await tgChat.app.notion.api.pages.create(request)

  if (!result.id) throw new Error(`No result id`)
}



// const dbResponse = await tgChat.app.notion.api.databases.retrieve({
//   database_id: tgChat.app.blogs[blogName].notion.buyTgDbId
// })
//
// const foundFormat = (dbResponse.properties['format'] as any).select.options
//   .find((item: {id: string, name: string}) => {
//
//   })
//
// if (!foundFormat) {
//   throw new Error(`Can't find specified format id`)
// }
//
// const formatId: string = BUY_AD_FORMAT_IDS[format]
//
// console.log(111, ()
//
//
// const adTypeId: string = BUY_AD_TYPE_IDS[adType];

// const BUY_AD_TYPE_IDS: Record<keyof typeof AD_BUY_TYPES, string> = {
//   bestArticles: 'ZpdT',
//   questionSolve: 'Th{s',
//   advert: '?QvM',
//   recommend: 'h{Sb',
// };
//
// const BUY_AD_FORMAT_IDS: Record<keyof typeof AD_FORMATS, string> = {
//   '1/24': 'CYmi',
//   '1/48': 'oR::',
//   '2/24': 'Ngws',
//   '2/48': 'N[vW',
//   '2/72': 'd?iO',
//   '3/24': 'I}Um',
//   '3/48': 'ZPsl',
//   '3/72': 'gSsX',
//   'full/24': ']?}Y',
//   'full/48': 'v?mt',
//   'full/72': 'Iov}',
//   forever: 'CX}m',
// };
