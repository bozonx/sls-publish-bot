import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {askCustomPostMenu, CustomPostState} from '../askUser/askCustomPostMenu';
import {publishImageTg, publishPostNoImageTg} from './publishHelpers';
import {makeDateTimeStr, prepareFooter} from '../helpers/helpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {publishTgImage, publishTgPostNoImage} from '../apiTg/publishTgPost';


export async function startPublishCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  footerTmpl?: string,
  mediaRequired = false,
  disableTags = false,
) {
  await askPostMedia(
    mediaRequired,
    true,
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

        await printPostPreview(blogName, tgChat, state, resultText);

        // TODO: блокирова ok - если превышение текста 1032 если есть картинка
        // TODO: блокирова ok - если превышение текста поста (2000 символов или сколько там)
        // TODO: блокирова ok - если нет ни картинки ни текста

        // if (!resultText) {
        //   // TODO: надо ещё заранее проверить наверное и написать пользователю
        //   throw new Error(`No text`);
        // }

        await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
          if (photoIdOrUrl.length === 1) {
            await publishImageTg(
              state.selectedDate!,
              state.selectedTime!,
              photoIdOrUrl[0],
              blogName,
              tgChat,
              resultText
            );
          }
          else if (photoIdOrUrl.length > 1) {
            // several images
            // TODO: а если несколько картинок ???
            throw new Error(`Not supported`);
          }
          else {
            await publishPostNoImageTg(
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
        }));
      }));
    }));
}


async function printPostPreview(
  blogName: string,
  tgChat: TgChat,
  state: CustomPostState,
  caption?: string,
) {
  if (state.images.length === 1) {
    await publishTgImage(
      tgChat.botChatId,
      state.images[0],
      blogName,
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

    await publishTgPostNoImage(
      tgChat.botChatId,
      caption,
      blogName,
      tgChat,
      !state.usePreview
    );
  }
  // preview state
  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.selectedNoPreview
    + tgChat.app.i18n.onOff[Number(state.usePreview)]
  );
  // date and time
  await tgChat.reply(tgChat.app.i18n.commonPhrases.pubDate + makeDateTimeStr(
    state.selectedDate!, state.selectedTime!, tgChat.app.appConfig.utcOffset
  ));
}
