import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {askCustomPostMenu, CustomPostState} from '../askUser/askCustomPostMenu';
import {compactUndefined} from '../lib/arrays';
import {publishImageTg} from './publishHelpers';


export async function startPublishCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  footerTmpl?: string,
  forceDisablePreview = false,
  mediaRequired = false,
) {
  await askPostMedia(
    mediaRequired,
    blogName,
    tgChat,
    tgChat.asyncCb(async (photoIdOrUrl: string[], caption?: string) => {
      // TODO: photoIdOrUrl может быть пустой
      // TODO: use caption

      //const footer = tgChat.app.config.blogs[blogName].sn.telegram?.storyFooter;
      // TODO: выполнит шаблон c тэгами
      //let footerStr = (footerTmpl) ? footerTmpl: undefined;

      // print result
      // TODO: а если несколько картинок ???
      // await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoIdOrUrl[0], {
      //   caption: footerTmpl,
      //   parse_mode: tgChat.app.appConfig.telegram.parseMode,
      // });

      const state: CustomPostState = {
        useFooter: true,
        // TODO: resolve usePreview - взависимости от картинки
        usePreview: true,
        // TODO: resolve forceDisablePreview - взависимости от картинки
        forceDisablePreview: true,
        footerTmpl,
        postText: caption,
      };

      await askMenu(blogName, tgChat, photoIdOrUrl, state);
    }));
}

async function askMenu(
  blogName: string,
  tgChat: TgChat,
  photoIdOrUrl: string[],
  state: CustomPostState
) {
  await askCustomPostMenu(blogName, tgChat, state, () => {
    // TODO: показать результат и спросить подтверждение

    const resultText = compactUndefined(
      [postText, (useFooter) ? footerStr : undefined]
    ).join('') || undefined;

    await publishImageTg(
      selectedDate!,
      selectedTime!,
      photoUrl,
      blogName,
      tgChat,
      resultText
    );

    await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
    await tgChat.steps.cancel();
  })
}