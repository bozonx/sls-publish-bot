import {PhotoData, PhotoUrlData, VideoData} from '../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {PackageContext} from '../packageManager/PackageContext';


export type PackageIndex = (ctx: PackageContext) => void
export type CurrencyTicker = 'RUB' | 'TRY' | 'EUR' | 'USD' | 'USDT' | 'BUSD';
export type MediaGroupItem = PhotoData | PhotoUrlData | VideoData

export const CURRENCY_TICKERS: Record<CurrencyTicker, CurrencyTicker> = {
  RUB: 'RUB',
  TRY: 'TRY',
  EUR: 'EUR',
  USD: 'USD',
  USDT: 'USDT',
  BUSD: 'BUSD',
};


export const AD_BUY_TYPES = {
  bestArticles: 'bestArticles',
  questionSolve: 'questionSolve',
  advert: 'advert',
  recommend: 'recommend',
};

export const AD_SELL_TYPES = {
  publishPost: 'publishPost',
  recommend: 'recommend',
  other: 'other',
};

export const AD_FORMATS = {
  '1/24': '1/24',
  '1/48': '1/48',
  '2/24': '2/24',
  '2/48': '2/48',
  '2/72': '2/72',
  '3/24': '3/24',
  '3/48': '3/48',
  '3/72': '3/72',
  'full/24': 'full/24',
  'full/48': 'full/48',
  'full/72': 'full/72',
  forever: 'forever',
}

export interface PrimitiveMediaGroup {
  type: 'photo' | 'video',
  url: string,
}
