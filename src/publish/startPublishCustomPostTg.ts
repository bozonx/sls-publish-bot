import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {askCustomPostMenu, CustomPostState} from '../askUser/askCustomPostMenu';
import {makePost2000Text, makeTaskTgPostImage, makeTaskTgPostOnlyText} from './publishHelpers';
import {clearMdText, makeDateTimeStr, prepareFooter} from '../helpers/helpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {publishTgImage, publishTgText} from '../apiTg/publishTg';
import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST, WARN_SIGN} from '../types/constants';
import validateCustomPost from './validateCustomPost';


export async function startPublishCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  footerTmpl?: string,
  mediaRequired = false,
  onlyOneImage = false,
  disableTags = false,
) {
  await askPostMedia(
    mediaRequired,
    onlyOneImage,
    blogName,
    tgChat,
    tgChat.asyncCb(async (photoIdOrUrl: string[], caption?: string) => {
      const state: CustomPostState = {
        useFooter: true,
        usePreview: !photoIdOrUrl.length,
        forceDisableFooter: !footerTmpl,
        forceDisablePreview: Boolean(photoIdOrUrl.length),
        disableTags,
        tags: [],
        postText: caption,
        images: photoIdOrUrl,
      };

      await askCustomPostMenu(blogName, tgChat, state, tgChat.asyncCb(async  () => {
        const footerStr = prepareFooter(footerTmpl, state.tags, state.useFooter);
        const resultText = (state.postText || '') + footerStr;
        const clearText = clearMdText(resultText);
        let disableOk = false;
        const isPost2000 = clearText.length > TELEGRAM_MAX_CAPTION
          && clearText.length < TELEGRAM_MAX_POST;

        if (isPost2000) await tgChat.reply(tgChat.app.i18n.message.post2000using);

        await printPostPreview(blogName, tgChat, state, resultText, clearText);

        try {
          validateCustomPost(state, isPost2000, clearText, tgChat);
        }
        catch (e) {
          await tgChat.reply(`${WARN_SIGN} ${e}`);

          disableOk = true;
        }


// TODO: распределение post1000 и post2000
//       картинка с описанием
//       * Если есть картинка и символов менее 1032
//       пост без картинки
//       * Если нет картинки и символов менее 2096
//       * Если есть картинка и символов более 1032 и менее 2096
//         + картинка загружается на telegra.ph

        await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
          if (photoIdOrUrl.length === 1) {
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
            }
            else {
              await makeTaskTgPostImage(
                state.selectedDate!,
                state.selectedTime!,
                photoIdOrUrl[0],
                blogName,
                tgChat,
                resultText
              );
            }
          }
          else if (photoIdOrUrl.length > 1) {
            // several images
            // TODO: а если несколько картинок ???
            throw new Error(`Not supported`);
          }
          else {
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
      }));
    })
  );
}


async function printPostPreview(
  blogName: string,
  tgChat: TgChat,
  state: CustomPostState,
  caption?: string,
  clearText = '',
) {
  if (state.images.length === 1) {
    await publishTgImage(
      tgChat.botChatId,
      state.images[0],
      tgChat,
      caption
    )
  }
  else if (state.images.length > 1) {
    // several images
    // TODO: а если несколько картинок ???
    throw new Error(`Not supported`);
  }
  else {
    // no image
    if (!caption) throw new Error(`No text`);

    await publishTgText(
      tgChat.botChatId,
      caption,
      tgChat,
      !state.usePreview
    );
  }
  // preview state
  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.selectedNoPreview
    + tgChat.app.i18n.onOff[Number(state.usePreview)] + '\n'
    + tgChat.app.i18n.commonPhrases.pubDate + makeDateTimeStr(
        state.selectedDate!, state.selectedTime!, tgChat.app.appConfig.utcOffset
      ) + '\n'
    + `${tgChat.app.i18n.pageInfo.contentLengthWithTgFooter}: ${clearText.length}\n`
    + `${tgChat.app.i18n.pageInfo.tagsCount}: ` + state.tags.length
  );
}
