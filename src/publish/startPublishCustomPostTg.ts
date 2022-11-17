import TgChat from '../apiTg/TgChat';
import {makePost2000Text, makeTaskTgPostImage, makeTaskTgPostOnlyText} from './publishHelpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {askCustomPostTg} from '../askUser/askCustomPostTg';
import {CustomPostState} from '../askUser/askCustomPostMenu';


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
    isPost2000: boolean,
    disableOk: boolean,
  ) => {

    // TODO: распределение post1000 и post2000
    //       картинка с описанием
    //       * Если есть картинка и символов менее 1032
    //       пост без картинки
    //       * Если нет картинки и символов менее 2096
    //       * Если есть картинка и символов более 1032 и менее 2096
    //         + картинка загружается на telegra.ph

    await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
      if (state.images.length === 1) {
        if (isPost2000) {
          const post2000Txt = await makePost2000Text(tgChat, resultText, state.images[0]);

          await makeTaskTgPostOnlyText(
            state.selectedDate!,
            state.selectedTime!,
            post2000Txt,
            blogName,
            tgChat,
            (state.images[0]) ? true : state.usePreview,
          );
        } else {
          await makeTaskTgPostImage(
            state.selectedDate!,
            state.selectedTime!,
            state.images[0],
            blogName,
            tgChat,
            resultText
          );
        }
      } else if (state.images.length > 1) {
        // several images
        // TODO: а если несколько картинок ???
        throw new Error(`Not supported`);
      } else {
        await makeTaskTgPostOnlyText(
          state.selectedDate!,
          state.selectedTime!,
          resultText,
          blogName,
          tgChat,
          state.usePreview
        );
      }

      await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
      await tgChat.steps.cancel();
    }), disableOk);
  }), footerTmpl, mediaRequired, onlyOneImage, disableTags);
}
