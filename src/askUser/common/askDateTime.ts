import TgChat from '../../apiTg/TgChat.js';
import {askDate} from './askDate.js';
import {makeHumanDateStr, makeHumanDateTimeStr} from '../../helpers/helpers.js';
import {askTime} from './askTime.js';


export async function askDateTime(tgChat: TgChat, onDone: (isoDate: string, time: string) => void, additionalMsg?: string) {
  await askDate(tgChat, tgChat.asyncCb(async (isoDate: string) => {
    const additionalMsg = tgChat.app.i18n.commonPhrases.selectedOnlyDate
      + makeHumanDateStr(isoDate, tgChat.app.appConfig.utcOffset)

    await askTime(tgChat, tgChat.asyncCb(async (time: string) => {
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedDateAndTime
        + makeHumanDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
      );

      onDone(isoDate, time);
    }), additionalMsg);
  }), additionalMsg);
}
