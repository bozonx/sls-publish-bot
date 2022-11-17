export type CurrencyTicker = 'RUB' | 'TRY' | 'EUR' | 'USD' | 'USDT' | 'BUSD';

export const CURRENCY_TICKERS: Record<CurrencyTicker, CurrencyTicker> = {
  RUB: 'RUB',
  TRY: 'TRY',
  EUR: 'EUR',
  USD: 'USD',
  USDT: 'USDT',
  BUSD: 'BUSD',
};

export type BuyAdType = 'best_articles' | 'question_solve' | 'advert' | 'recommend';
