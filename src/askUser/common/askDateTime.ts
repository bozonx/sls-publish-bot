import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {askDate} from './askDate.js';
import {makeHumanDateStr, makeHumanDateTimeStr, makeIsoDateTimeStr} from '../../helpers/helpers.js';
import {askTime} from './askTime.js';
import {WARN_SIGN} from '../../types/constants.js';


export async function askDateTime(
  tgChat: TgChat,
  onDone: (isoDate: string, time: string) => void,
  additionalMsg?: string,
  stepName?: string,
  hasBeGreaterThanCurrent = false
) {
  await askDate(tgChat, tgChat.asyncCb(async (isoDate: string) => {
    // поидее нет смысла, так как контрол всеравно не даст установмить меньше дату
    // if (hasBeGreaterThanCurrent) {
    //   if (
    //     // do not need to convert to utc because it doesn't have time
    //     moment(isoDate).utc(true).unix()
    //     < moment().utc(true).hours(0).minutes(0).seconds(0).unix()
    //   ) {
    //     await tgChat.reply(
    //       WARN_SIGN + ' ' + tgChat.app.i18n.errors.dateHasToBeGreaterThanCurrent
    //     )
    //
    //     return
    //   }
    // }

    const additionalMsg = tgChat.app.i18n.commonPhrases.selectedOnlyDate
      + makeHumanDateStr(isoDate, tgChat.app.appConfig.utcOffset)

    await askTime(tgChat, tgChat.asyncCb(async (time: string) => {
      if (hasBeGreaterThanCurrent) {
        if (
          moment(makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)).utc().unix()
          < (moment().utc().unix() + tgChat.app.appConfig.expiredTaskOffsetSec)
        ) {
          await tgChat.reply(
            WARN_SIGN + ' '
            + tgChat.app.i18n.errors.dateTimeHasToBeGreaterThanCurrent
            + tgChat.app.appConfig.expiredTaskOffsetSec + ' '
            + tgChat.app.i18n.commonPhrases.seconds
          )

          return
        }
      }

      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedDateAndTime
        + makeHumanDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
      );

      onDone(isoDate, time);
    }), additionalMsg);
  }), additionalMsg, stepName);
}
