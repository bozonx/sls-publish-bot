import TgChat from '../apiTg/TgChat';
import {makePost2000Text, makeTaskTgPostImage, makeTaskTgPostOnlyText} from './publishHelpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {askCustomPostTg} from '../askUser/askCustomPostTg';
import {CustomPostState} from '../askUser/askCustomPostMenu';
import {askDateTime} from '../askUser/askDateTime';


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

      await makeTaskTgPostOnlyText(
        isoDate,
        time,
        post2000Txt,
        blogName,
        tgChat,
        (images[0]) ? true : usePreview,
      );
    } else {
      await makeTaskTgPostImage(
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
    await makeTaskTgPostOnlyText(
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
