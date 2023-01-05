import TgChat from '../../apiTg/TgChat.js';
import {makeResultPostText} from '../../helpers/helpers.js';
import {askPostMedia} from '../common/askPostMedia.js';
import {askCustomPostMenu} from './askCustomPostMenu.js';
import validateCustomPost from '../../publish/validateCustomPost.js';
import {printPost} from '../../publish/publishHelpers.js';
import {MediaGroupItem} from '../../types/types.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {clearMd} from '../../helpers/clearMd.js';


export interface CustomPostState {
  useFooter: boolean
  usePreview: boolean
  forceDisableFooter: boolean
  disableTags: boolean
  tags: string[]
  postMdText?: string
  cleanPostText?: string
  mediaGroup: MediaGroupItem[]
  urlBtn?: TgReplyBtnUrl
  autoDeleteIsoDateTime?: string
  footerTmpl?: string
  cleanFooterTmpl?: string
  postAsText: boolean
  //resultText?: string;
}


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
    tgChat,
    mediaRequired,
    onlyOneImage,
    tgChat.asyncCb(async (mediaGroup, caption) => {
      const state: CustomPostState = {
        useFooter: true,
        usePreview: !mediaGroup.length,
        forceDisableFooter: !footerTmpl,
        disableTags,
        tags: [],
        postMdText: caption,
        mediaGroup,
        // TODO: преобразовать
        footerTmpl,
        cleanFooterTmpl: clearMd(footerTmpl),
        postAsText,
      };

      await askCustomPostMenu(
        blogName,
        tgChat,
        state,
        validateCustomPost,
        tgChat.asyncCb(async  () => {
          // TODO: переместить ???
          const resultText = makeResultPostText(state.tags, state.useFooter, state.postMdText, state.footerTmpl);

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
  const cleanFullText = makeResultPostText(
    state.tags,
    state.useFooter,
    state.cleanPostText,
    state.cleanFooterTmpl
  )

  // print post preview
  await printPost(
    tgChat.botChatId,
    tgChat,
    state.usePreview,
    state.mediaGroup,
    state.urlBtn,
    resultText
  )
  // print post summary
  await tgChat.reply(
    tgChat.app.i18n.commonPhrases.linkWebPreview
      + tgChat.app.i18n.onOff[Number(state.usePreview)] + '\n'
    + `${tgChat.app.i18n.pageInfo.contentLengthWithTgFooter}: ${cleanFullText.length}\n`
    + `${tgChat.app.i18n.pageInfo.tagsCount}: ` + state.tags.length
  );
}


// + tgChat.app.i18n.commonPhrases.pubDate + makeHumanDateTimeStr(
//   state.selectedDate!, state.selectedTime!, tgChat.app.appConfig.utcOffset
// ) + '\n'

// const isPost2000 = clearText.length > TELEGRAM_MAX_CAPTION
//   && clearText.length < TELEGRAM_MAX_POST;