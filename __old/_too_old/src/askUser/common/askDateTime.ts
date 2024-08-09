import moment from 'moment';
import TgChat from '../../apiTg/TgChat';
import {askDate} from './askDate';
import {makeHumanDateStr, makeHumanDateTimeStr, makeIsoDateTimeStr} from '../../helpers/helpers';
import {askTime} from './askTime';
import {MAX_TIMEOUT_SECONDS, WARN_SIGN} from '../../types/constants';


export async function askDateTime(
  tgChat: TgChat,
  onDone: (isoDate: string, time: string) => void,
  additionalMsg?: string,
  stepName?: string,
  hasBeGreaterThanCurrent = false,
  checkMaxTaskTime = false,
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
      const isoDateTime = makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
      const isoDateTimeUnix = moment(isoDateTime).unix()
      const currentUnix = moment().unix()

      if (hasBeGreaterThanCurrent) {
        if (
          isoDateTimeUnix
          < (currentUnix + tgChat.app.appConfig.expiredTaskOffsetSec)
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

      if (checkMaxTaskTime) {
        if (isoDateTimeUnix > currentUnix + MAX_TIMEOUT_SECONDS) {
          await tgChat.reply(
            WARN_SIGN + ' '
            + `Too big date! Max is (${MAX_TIMEOUT_SECONDS}) seconds (24 days)`
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
