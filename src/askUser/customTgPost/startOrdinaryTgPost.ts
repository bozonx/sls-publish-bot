import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {askConfirm} from '../common/askConfirm.js';
import {askCustomPostTg, CustomPostState} from './askCustomPostTg.js';
import {askDateTime} from '../common/askDateTime.js';
import {registerTgPost} from '../../helpers/registerTgPost.js';
import {addHorsInDate, makeIsoDateTimeStr} from '../../helpers/helpers.js';
import {WARN_SIGN} from '../../types/constants.js';


const ORDINARY_POST_DATE_STEP = 'ORDINARY_POST_DATE_STEP';


export async function startOrdinaryTgPost(
  blogName: string,
  tgChat: TgChat,
  // post as only text. If false then as image or video
  postAsText: boolean,
  footerTmpl?: string,
  mediaRequired = false,
  onlyOneImage = true,
  disableTags = false
) {
  await askCustomPostTg(blogName, tgChat, tgChat.asyncCb(async (
    state: CustomPostState,
    resultTextHtml: string
  ) => {
    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      let resolvedAutoDeleteTime = state.autoDeleteTgIsoDateTime

      // validate that selected date is greater than auto-delete date
      if (
        resolvedAutoDeleteTime && moment(resolvedAutoDeleteTime).unix()
        <= moment(makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)).unix()
      ) {
        await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

        return await tgChat.steps.to(ORDINARY_POST_DATE_STEP)
      }

      if (state.autoDeletePeriodHours) {
        resolvedAutoDeleteTime = addHorsInDate(
          makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset),
          state.autoDeletePeriodHours
        )
      }

      await askConfirm(tgChat, tgChat.asyncCb(async () => {
        try {
          await registerTgPost(
            blogName,
            tgChat,
            isoDate,
            time,
            resultTextHtml,
            postAsText,
            state.usePreview,
            state.mediaGroup,
            state.tgUrlBtn,
            resolvedAutoDeleteTime
          )
        }
        catch (e) {
          await tgChat.reply(String(e))

          return
        }
        await tgChat.steps.cancel();
      }), tgChat.app.i18n.commonPhrases.publishConfirmation);
    }), undefined, ORDINARY_POST_DATE_STEP, true, true);
  }), postAsText, footerTmpl, mediaRequired, onlyOneImage, disableTags);
}
