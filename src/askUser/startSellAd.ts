import TgChat from '../apiTg/TgChat';
import {startPublishCustomPostTg} from '../publish/startPublishCustomPostTg';
import {askCost} from './askCost';
import {AdFormat, CurrencyTicker} from '../types/types';
import {askFormat} from './askFormat';


export async function startSellAd(blogName: string, tgChat: TgChat) {
  await startPublishCustomPostTg(
    blogName,
    tgChat,
    undefined,
    undefined,
    undefined,
    true,
    () => {

    }
  );
  // TODO: расшарить пости или скинуть картинку или текст
  // TODO: ask date
  // TODO: ask time
  // TODO: ask cost - добавить - ничего не выбранно
  await askCost(tgChat, tgChat.asyncCb(async (cost: number, currency: CurrencyTicker) => {
    await askFormat(tgChat, tgChat.asyncCb(async (format: AdFormat) => {
      // TODO: ask вп ???
    }));
  }));

}
