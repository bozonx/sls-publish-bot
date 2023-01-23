import {PhotoData, PhotoUrlData, VideoData} from './MessageEvent.js';

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

export type BuyAdType = 'best_articles' | 'question_solve' | 'advert' | 'recommend';

export const AD_BUY_TYPES: Record<BuyAdType, BuyAdType> = {
  best_articles: 'best_articles',
  question_solve: 'question_solve',
  advert: 'advert',
  recommend: 'recommend',
};

export type SellAdType = 'publish_post' | 'recommend' | 'other';

export const AD_SELL_TYPES: Record<SellAdType, SellAdType> = {
  publish_post: 'publish_post',
  recommend: 'recommend',
  other: 'other',
};

export type AdFormat = '1/24' | '1/48' | '2/24' | '2/48' | '2/72' | '3/24' | '3/48' | '3/72'
  | 'full/24' | 'full/48' | 'full/72' | 'forever';

export const AD_FORMATS: Record<AdFormat, AdFormat> = {
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
