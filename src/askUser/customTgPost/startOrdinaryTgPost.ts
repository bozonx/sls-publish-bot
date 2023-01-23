import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {makePost2000Text} from '../../publish/publishHelpers.js';
import {askConfirm} from '../common/askConfirm.js';
import {askCustomPostTg, CustomPostState} from './askCustomPostTg.js';
import {askDateTime} from '../common/askDateTime.js';
import {makePublishTaskTgImage, makePublishTaskTgOnlyText, makePublishTaskTgVideo} from '../../publish/makePublishTaskTg.js';
import {PhotoData, PhotoUrlData, VideoData} from '../../types/MessageEvent.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {makeIsoDateTimeStr, replaceHorsInDate} from '../../helpers/helpers.js';
import {WARN_SIGN} from '../../types/constants.js';


const ORDINARY_POST_DATE_STEP = 'ORDINARY_POST_DATE_STEP';


export async function startOrdinaryTgPost(
  blogName: string,
  tgChat: TgChat,
  // post as only text. If false then as image or video
  postAsText: boolean,
  footerTmpl?: string,
  mediaRequired = false,
  // TODO: наверное не нужно
  onlyOneImage = false,
  disableTags = false
) {
  await askCustomPostTg(blogName, tgChat, tgChat.asyncCb(async (
    state: CustomPostState,
    resultText: string
  ) => {
    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      let resolvedAutoDeleteTime = state.autoDeleteIsoDateTime

      // validate that selected date is greater than auto-delete date
      if (
        resolvedAutoDeleteTime && moment(resolvedAutoDeleteTime).unix()
        <= moment(makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)).unix()
      ) {
        await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

        return await tgChat.steps.to(ORDINARY_POST_DATE_STEP)
      }

      if (state.autoDeletePeriodHours) {
        resolvedAutoDeleteTime = replaceHorsInDate(
          makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset),
          state.autoDeletePeriodHours
        )
      }

      await askConfirm(tgChat, tgChat.asyncCb(async () => {
        await registerCustomPostTg(
          blogName,
          tgChat,
          isoDate,
          time,
          resultText,
          postAsText,
          state.usePreview,
          state.mediaGroup,
          state.urlBtn,
          resolvedAutoDeleteTime
        );
        await tgChat.steps.cancel();
      }), tgChat.app.i18n.commonPhrases.publishConfirmation);
    }), undefined, ORDINARY_POST_DATE_STEP);
  }), postAsText, footerTmpl, mediaRequired, onlyOneImage, disableTags);
}


// TODO: почему так ???

/**
 * Register custom post creating task
 */
export async function registerCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  resultText: string,
  postAsText: boolean,
  usePreview: boolean,
  mediaGroup: (PhotoData | PhotoUrlData | VideoData)[],
  urlBtn?: TgReplyBtnUrl,
  autoDeleteIsoDateTime?: string
) {
  if (postAsText) {
    // post as only text
    const imgUrl: string | undefined = resolveImageUrl(mediaGroup)
    const post2000Txt = await makePost2000Text(tgChat, resultText, imgUrl);

    await makePublishTaskTgOnlyText(
      blogName,
      tgChat,
      isoDate,
      time,
      post2000Txt,
      (imgUrl) ? true : usePreview,
      urlBtn,
      autoDeleteIsoDateTime
    );
  }
  else if (mediaGroup.length > 1) {
    // post several images
    // TODO: а если несколько картинок ???
    throw new Error(`Not supported`);
  }
  else {
    // post as image or video caption
    if (mediaGroup[0].type === 'video') {
      if (!mediaGroup[0].fileId) throw new Error(`No video fileId`);

      await makePublishTaskTgVideo(
        blogName,
        tgChat,
        isoDate,
        time,
        mediaGroup[0].fileId,
        resultText,
        urlBtn,
        autoDeleteIsoDateTime
      );
    }
    else {
      const imgUrl: string | undefined = resolveImageUrl(mediaGroup)

      if (!imgUrl) throw new Error(`No image`);

      await makePublishTaskTgImage(
        blogName,
        tgChat,
        isoDate,
        time,
        imgUrl,
        resultText,
        urlBtn,
        autoDeleteIsoDateTime
      );
    }
  }

  await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
}

function resolveImageUrl(mediaGroup: (PhotoData | PhotoUrlData | VideoData)[]): string | undefined {
  if (!mediaGroup.length) return
  else if (mediaGroup[0].type === 'photo') return mediaGroup[0].fileId
  else if (mediaGroup[0].type === 'photoUrl') return mediaGroup[0].url
}

