import TgChat from '../../apiTg/TgChat.js';
import {clearMdText, makeResultPostText} from '../../helpers/helpers.js';
import {publishTgImage, publishTgMediaGroup, publishTgText, publishTgVideo} from '../../apiTg/publishTg.js';
import {askPostMedia} from '../common/askPostMedia.js';
import {askCustomPostMenu, CustomPostState} from './askCustomPostMenu.js';
import validateCustomPost from '../../publish/validateCustomPost.js';


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
          const clearText = clearMdText(resultText);

          await printPostPreview(blogName, tgChat, state, resultText, clearText);

          onDone(state, resultText);
        }
      ));
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
  if (state.mediaGroup.length > 1) {
    // media group
    await publishTgMediaGroup(
      tgChat.botChatId,
      state.mediaGroup,
      tgChat,
      caption
    );
  }
  else if (state.mediaGroup.length) {
    if (state.mediaGroup[0].type === 'video') {
      await publishTgVideo(
        tgChat.botChatId,
        state.mediaGroup[0].fileId,
        tgChat,
        caption,
        state.urlBtn
      );
    }
    else if (state.mediaGroup[0].type === 'photo') {
      await publishTgImage(
        tgChat.botChatId,
        state.mediaGroup[0].fileId,
        tgChat,
        caption,
        state.urlBtn
      );
    }
    else if (state.mediaGroup[0].type === 'photoUrl') {
      await publishTgImage(
        tgChat.botChatId,
        state.mediaGroup[0].url,
        tgChat,
        caption,
        state.urlBtn
      );
    }
  }
  else {
    // no image or video
    if (!caption) throw new Error(`No text`);

    await publishTgText(
      tgChat.botChatId,
      caption,
      tgChat,
      state.usePreview,
      state.urlBtn
    );
  }
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