import TgChat from '../apiTg/TgChat';
import {makePost2000Text} from '../publish/publishHelpers';
import {askPostConfirm} from './askPostConfirm';
import {askCustomPostTg} from './askCustomPostTg';
import {CustomPostState} from './askCustomPostMenu';
import {askDateTime} from './askDateTime';
import {makePublishTaskTgImage, makePublishTaskTgOnlyText, makePublishTaskTgVideo} from '../publish/makePublishTaskTg';
import {PhotoData, PhotoUrlData, VideoData} from '../types/MessageEvent';
import {TgReplyBtnUrl} from '../types/TgReplyButton';


export async function startPublishCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  footerTmpl?: string,
  mediaRequired = false,
  onlyOneImage = false,
  disableTags = false,
) {
  await askCustomPostTg(blogName, tgChat, tgChat.asyncCb(async (
    state: CustomPostState,
    resultText: string,
    isPost2000: boolean
  ) => {
    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
        await registerCustomPostTg(
          blogName,
          tgChat,
          isoDate,
          time,
          resultText,
          isPost2000,
          state.usePreview,
          state.mediaGroup,
          state.urlBtn,
          state.autoDeleteIsoDateTime
        );
        await tgChat.steps.cancel();
      }));
    }));
  }), footerTmpl, mediaRequired, onlyOneImage, disableTags);
}

export async function registerCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  resultText: string,
  isPost2000: boolean,
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

    if (isPost2000) {
      const post2000Txt = await makePost2000Text(tgChat, resultText, imgUrl);

      await makePublishTaskTgOnlyText(
        isoDate,
        time,
        post2000Txt,
        blogName,
        tgChat,
        (imgUrl) ? true : usePreview,
        urlBtn
      );
    }
    else {
      if (mediaGroup[0].type === 'video') {
        await makePublishTaskTgVideo(
          isoDate,
          time,
          mediaGroup[0].fileId,
          blogName,
          tgChat,
          resultText,
          urlBtn
        );
      }
      else {
        if (!imgUrl) throw new Error(`No image`);

        await makePublishTaskTgImage(
          isoDate,
          time,
          imgUrl,
          blogName,
          tgChat,
          resultText,
          urlBtn
        );
      }
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
      urlBtn
    );
  }

  await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
}
