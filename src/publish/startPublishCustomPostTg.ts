import _ from 'lodash';
import TgChat from '../apiTg/TgChat';
import {askPostMedia} from '../askUser/askPostMedia';
import {askCustomPostMenu, CustomPostState} from '../askUser/askCustomPostMenu';
import {compactUndefined} from '../lib/arrays';
import {publishImageTg, publishPostNoImageTg} from './publishHelpers';
import {makeDateTimeStr, makeTagsString} from '../helpers/helpers';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {publishTgImage, publishTgPost} from '../apiTg/publishTgPost';


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
      };

      await askCustomPostMenu(blogName, tgChat, state, tgChat.asyncCb(async  () => {
        const footer = (state.useFooter && footerTmpl)
          ? _.template(footerTmpl)({ TAGS: makeTagsString(state.tags) })
          : undefined;
        const resultText = compactUndefined(
          [state.postText, footer]
        ).join('') || undefined;

        await printPostPreview(
          blogName,
          tgChat,
          photoIdOrUrl,
          state.selectedDate!,
          state.selectedTime!,
          state.usePreview,
          resultText
        );

        await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {

          // TODO: photoIdOrUrl может быть пустой - тогда обычный пост

          if (photoIdOrUrl.length) {
            await publishImageTg(
              state.selectedDate!,
              state.selectedTime!,
              // TODO: несколько картинок как ???
              photoIdOrUrl[0],
              blogName,
              tgChat,
              resultText
            );
          }
          else {
            if (!resultText) {
              // TODO: надо ещё заранее проверить наверное и написать пользователю
              throw new Error(`No text`);
            }

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
  photoIdOrUrl: string[],
  pubDate: string,
  pubTime: string,
  usePreview: boolean,
  caption?: string,
) {
  // TODO: а если несколько картинок ???
  if (photoIdOrUrl.length) {
    await publishTgImage(
      tgChat.botChatId,
      photoIdOrUrl[0],
      blogName,
      tgChat,
      caption
    )
  }
  else {
    // TODO: проверит заранее
    if (!caption) throw new Error(`No text`);

    await publishTgPost(
      tgChat.botChatId,
      caption,
      blogName,
      tgChat,
      !usePreview
    );
  }

  // await tgChat.app.tg.bot.telegram.sendPhoto(tgChat.botChatId, photoIdOrUrl[0], {
  //   caption,
  //   parse_mode: tgChat.app.appConfig.telegram.parseMode,
  // });

  // preview state
  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.selectedNoPreview
    + tgChat.app.i18n.onOff[Number(usePreview)]
  );

  // date and time
  await tgChat.reply(tgChat.app.i18n.commonPhrases.pubDate + makeDateTimeStr(
    pubDate, pubTime, tgChat.app.appConfig.utcOffset
  ));
}
