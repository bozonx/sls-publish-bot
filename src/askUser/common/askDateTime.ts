import TgChat from '../../apiTg/TgChat.js';
import {askDate} from './askDate.js';
import {makeUtcOffsetStr} from '../../helpers/helpers.js';
import {askTime} from './askTime.js';
import moment from 'moment';
import {PRINT_FULL_DATE_FORMAT} from '../../types/constants.js';


export async function askDateTime(tgChat: TgChat, onDone: (isoDate: string, time: string) => void, additionalMsg?: string) {
  await askDate(tgChat, tgChat.asyncCb(async (isoDate: string) => {
    const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
    const additionalMsg = tgChat.app.i18n.commonPhrases.selectedOnlyDate
      + `${isoDate} ${utcOffset}`

    await askTime(tgChat, tgChat.asyncCb(async (time: string) => {
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedDateAndTime
        + `${moment(isoDate).format(PRINT_FULL_DATE_FORMAT)} ${time} ${utcOffset}`
      );

      onDone(isoDate, time);
    }), additionalMsg);
  }), additionalMsg);
}
