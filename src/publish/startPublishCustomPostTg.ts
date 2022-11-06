import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {askCustomPostMenu, CustomPostState} from '../askUser/askCustomPostMenu';
import {compactUndefined} from '../lib/arrays';
import {publishImageTg} from './publishHelpers';
import {makeDateTimeStr} from '../helpers/helpers';
import {askPostConfirm} from '../askUser/askPostConfirm';


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


      const state: CustomPostState = {
        useFooter: true,
        // TODO: resolve usePreview - взависимости от картинки
        usePreview: true,
        forceDisableFooter: !footerTmpl,
        // TODO: resolve forceDisablePreview - взависимости от картинки
        forceDisablePreview: true,
        postText: caption,
      };

      await askCustomPostMenu(blogName, tgChat, state, tgChat.asyncCb(async  () => {
        // TODO: текст для инсты
        const resultText = compactUndefined(
          // TODO: создать темплейт с тэгами
          [state.postText, (state.useFooter) ? footerTmpl : undefined]
        ).join('') || undefined;

        await printPostPreview(
          tgChat,
          photoIdOrUrl,
          state.selectedDate!,
          state.selectedTime!,
          state.usePreview,
          resultText
        );

        await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
          await publishImageTg(
            state.selectedDate!,
            state.selectedTime!,
            // TODO: несколько картинок как ???
            photoIdOrUrl[0],
            blogName,
            tgChat,
            resultText
          );

          await tgChat.reply(tgChat.app.i18n.message.taskRegistered);
          await tgChat.steps.cancel();
        }));
      }));
    }));
}


async function printPostPreview(
  tgChat: TgChat,
  photoIdOrUrl: string[],
  pubDate: string,
  pubTime: string,
  usePreview: boolean,
  caption?: string,
) {
  // TODO: а если несколько картинок ???
  await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoIdOrUrl[0], {
    caption,
    parse_mode: tgChat.app.appConfig.telegram.parseMode,
  });

  // preview
  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.selectedNoPreview
    + tgChat.app.i18n.onOff[Number(usePreview)]
  );

  // date and time
  await tgChat.reply(tgChat.app.i18n.commonPhrases.pubDate + makeDateTimeStr(
    pubDate, pubTime, tgChat.app.appConfig.utcOffset
  ));
}
