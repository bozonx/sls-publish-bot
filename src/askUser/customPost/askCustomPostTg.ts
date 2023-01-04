import TgChat from '../../apiTg/TgChat.js';
import {clearMdText, makeResultPostText} from '../../helpers/helpers.js';
import {askPostMedia} from '../common/askPostMedia.js';
import {askCustomPostMenu, CustomPostState} from './askCustomPostMenu.js';
import validateCustomPost from '../../publish/validateCustomPost.js';
import {printPost} from '../../publish/publishHelpers.js';


export async function askCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  onDone: (state: CustomPostState, resultText: string) => void,
  // post as only text. If false then as image or video
  postAsText: boolean,
  footerTmpl?: string,
  mediaRequired = false,
  // TODO: наверное не нужно
  onlyOneImage = false,
  disableTags = false,
) {
  await askPostMedia(
    mediaRequired,
    onlyOneImage,
    blogName,
    tgChat,
    tgChat.asyncCb(async ({mediaGroup, caption}) => {
      const state: CustomPostState = {
        useFooter: true,
        usePreview: !mediaGroup.length,
        forceDisableFooter: !footerTmpl,
        disableTags,
        tags: [],
        postText: caption,
        mediaGroup,
      };

      await askCustomPostMenu(
        blogName,
        tgChat,
        state,
        (tgChat: TgChat, state: CustomPostState) => {
          const resultText = makeResultPostText(state.tags, state.useFooter, state.postText, footerTmpl);
          const clearText = clearMdText(resultText);

          validateCustomPost(state, isPost2000, clearText, tgChat);
        },
        tgChat.asyncCb(async  () => {
          const resultText = makeResultPostText(state.tags, state.useFooter, state.postText, footerTmpl);

          await printPostPreview(tgChat, state, resultText);

          onDone(state, resultText);
        }
      ));
    })
  );
}


async function printPostPreview(
  tgChat: TgChat,
  state: CustomPostState,
  resultText = '',
) {
  const clearText = clearMdText(resultText);

  await printPost(
    tgChat.botChatId,
    tgChat,
    state.usePreview,
    state.mediaGroup,
    state.urlBtn,
    resultText
  )
  // preview state
  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.selectedNoPreview
      + tgChat.app.i18n.onOff[Number(state.usePreview)] + '\n'
    + `${tgChat.app.i18n.pageInfo.contentLengthWithTgFooter}: ${clearText.length}\n`
    + `${tgChat.app.i18n.pageInfo.tagsCount}: ` + state.tags.length
  );
}


// + tgChat.app.i18n.commonPhrases.pubDate + makeDateTimeStr(
//   state.selectedDate!, state.selectedTime!, tgChat.app.appConfig.utcOffset
// ) + '\n'

// const isPost2000 = clearText.length > TELEGRAM_MAX_CAPTION
//   && clearText.length < TELEGRAM_MAX_POST;