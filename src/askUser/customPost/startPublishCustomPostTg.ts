import TgChat from '../../apiTg/TgChat.js';
import {makePost2000Text} from '../../publish/publishHelpers.js';
import {askPostConfirm} from '../common/askPostConfirm.js';
import {askCustomPostTg} from './askCustomPostTg.js';
import {CustomPostState} from './askCustomPostMenu.js';
import {askDateTime} from '../common/askDateTime.js';
import {makePublishTaskTgImage, makePublishTaskTgOnlyText, makePublishTaskTgVideo} from '../../publish/makePublishTaskTg.js';
import {PhotoData, PhotoUrlData, VideoData} from '../../types/MessageEvent.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';


export async function startPublishCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  // post as only text. If false then as image or video
  postAsText: boolean,
  footerTmpl?: string,
  mediaRequired = false,
  // TODO: наверное не нужно
  onlyOneImage = false,
  disableTags = false,
) {
  await askCustomPostTg(blogName, tgChat, tgChat.asyncCb(async (
    state: CustomPostState,
    resultText: string
  ) => {
    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
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
          state.autoDeleteIsoDateTime
        );
        await tgChat.steps.cancel();
      }));
    }));
  }), postAsText, footerTmpl, mediaRequired, onlyOneImage, disableTags);
}

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



  if (mediaGroup.length === 1) {
    const imgUrl: string | undefined =
      (mediaGroup[0].type === 'photo' && mediaGroup[0].fileId)
      || (mediaGroup[0].type === 'photoUrl' && mediaGroup[0].url)
      || undefined;

    if (postAsText) {
      // post as image or videl caption
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
    else {
      // post as only text
      // TODO: review
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
  } else if (mediaGroup.length > 1) {
    // several images
    // TODO: а если несколько картинок ???
    throw new Error(`Not supported`);
  } else {
    await makePublishTaskTgOnlyText(
      isoDate,
      time,
      resultText,
      blogName,
      tgChat,
      usePreview,
      urlBtn,
      autoDeleteIsoDateTime
    );
  }

  await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
}
