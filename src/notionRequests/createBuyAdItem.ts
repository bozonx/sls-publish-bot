import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints.js';
import TgChat from '../apiTg/TgChat.js';
import {AD_BUY_TYPES, AD_FORMATS} from '../types/types.js';


// TODO: это нафига???
const BUY_AD_TYPE_IDS: Record<keyof typeof AD_BUY_TYPES, string> = {
  bestArticles: 'ZpdT',
  questionSolve: 'Th{s',
  advert: '?QvM',
  recommend: 'h{Sb',
};

// TODO: это нафига???
const BUY_AD_FORMAT_IDS: Record<keyof typeof AD_FORMATS, string> = {
  '1/24': 'CYmi',
  '1/48': 'oR::',
  '2/24': 'Ngws',
  '2/48': 'N[vW',
  '2/72': 'd?iO',
  '3/24': 'I}Um',
  '3/48': 'ZPsl',
  '3/72': 'gSsX',
  'full/24': ']?}Y',
  'full/48': 'v?mt',
  'full/72': 'Iov}',
  forever: 'CX}m',
};


export async function createBuyAdItem(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  adType: keyof typeof AD_BUY_TYPES,
  format: keyof typeof AD_FORMATS,
  channelName: string,
  channelUrl?: string,
  cost?: number,
  note?: string,
) {
  // TODO: note - преобразовать html в notion

  // TODO: вместо этого выгрузить данные из notion

  const adTypeId: string = BUY_AD_TYPE_IDS[adType];

  // TODO: вместо этого выгрузить данные из notion

  const formatId: string = BUY_AD_FORMAT_IDS[format]


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
      ad_type: {
        type: 'select',
        select: {
          id: adTypeId,
        }
      },
      format: {
        type: 'select',
        select: {
          id: formatId,
        }
      },
      channel: {
        type: 'rich_text',
        rich_text: [{
          type: 'text',
          text: {
            content: channelName,
            link: (channelUrl) ? { url: channelUrl } : undefined,
          },
        }],
      },
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

  const result = await tgChat.app.notion.api.pages.create(request);

  if (!result.id) throw new Error(`No result id`)
}
