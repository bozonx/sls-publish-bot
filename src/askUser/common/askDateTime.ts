import TgChat from '../../apiTg/TgChat.js';
import {askDate} from './askDate.js';
import {makeUtcOffsetStr} from '../../helpers/helpers.js';
import {askTime} from './askTime.js';


export async function askDateTime(tgChat: TgChat, onDone: (isoDate: string, time: string) => void) {
  await askDate(tgChat, tgChat.asyncCb(async (isoDate: string) => {
    const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);

    await tgChat.reply(
      tgChat.app.i18n.commonPhrases.selectedOnlyDate
      + `${isoDate} ${utcOffset}`
    );

    await askTime(tgChat, tgChat.asyncCb(async (time: string) => {
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.pubDate
        + `${isoDate} ${time} ${utcOffset}`
      );

      onDone(isoDate, time);
    }));
  }));
}
