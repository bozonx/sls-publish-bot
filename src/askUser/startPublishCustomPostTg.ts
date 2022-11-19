import TgChat from '../apiTg/TgChat';
import {makePost2000Text} from '../publish/publishHelpers';
import {askPostConfirm} from './askPostConfirm';
import {askCustomPostTg} from './askCustomPostTg';
import {CustomPostState} from './askCustomPostMenu';
import {askDateTime} from './askDateTime';
import {makePublishTaskTgImage, makePublishTaskTgOnlyText} from '../publish/makePublishTaskTg';


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
          state.images
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
  images: string[]
) {
  if (images.length === 1) {
    if (isPost2000) {
      const post2000Txt = await makePost2000Text(tgChat, resultText, images[0]);

      await makePublishTaskTgOnlyText(
        isoDate,
        time,
        post2000Txt,
        blogName,
        tgChat,
        (images[0]) ? true : usePreview,
      );
    } else {
      await makePublishTaskTgImage(
        isoDate,
        time,
        images[0],
        blogName,
        tgChat,
        resultText
      );
    }
  } else if (images.length > 1) {
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
      usePreview
    );
  }

  await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
}