import TgChat from '../../apiTg/TgChat.js';
import {makeResultPostText} from '../../helpers/helpers.js';
import {askPostMedia} from '../common/askPostMedia.js';
import {askCustomPostMenu} from './askCustomPostMenu.js';
import validateCustomPost from '../../publish/validateCustomPost.js';
import {printPost} from '../../publish/publishHelpers.js';
import {MediaGroupItem} from '../../types/types.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {convertCommonMdToCleanText} from '../../helpers/convertCommonMdToCleanText.js';
import {convertCommonMdToTgHtml} from '../../helpers/convertCommonMdToTgHtml.js';


export interface CustomPostState {
  useFooter: boolean
  usePreview: boolean
  forceDisableFooter: boolean
  disableTags: boolean
  tags: string[]
  postHtmlText?: string
  cleanPostText?: string
  mediaGroup: MediaGroupItem[]
  tgUrlBtn?: TgReplyBtnUrl
  autoDeleteTgIsoDateTime?: string
  autoDeletePeriodHours?: number
  footerTmplHtml?: string
  cleanFooterTmpl?: string
  postAsText: boolean
  onlyOneImage: boolean
  //resultTextHtml?: string;
}


export async function askCustomPostTg(
  blogName: string,
  tgChat: TgChat,
  onDone: (state: CustomPostState, resultTextHtml: string) => void,
  // post as only text. If false then as image or video
  postAsText: boolean,
  footerTmpl: string | undefined,
  mediaRequired: boolean,
  onlyOneImage: boolean,
  disableTags: boolean,
) {
  await askPostMedia(
    tgChat,
    mediaRequired,
    onlyOneImage,
    tgChat.asyncCb(async (mediaGroup, captionHtml) => {
      const state: CustomPostState = {
        useFooter: true,
        usePreview: !mediaGroup.length,
        forceDisableFooter: !footerTmpl,
        disableTags,
        tags: [],
        postHtmlText: captionHtml,
        mediaGroup,
        footerTmplHtml: await convertCommonMdToTgHtml(footerTmpl),
        cleanFooterTmpl: await convertCommonMdToCleanText(footerTmpl),
        postAsText,
        onlyOneImage,
      };

      await askCustomPostMenu(
        blogName,
        tgChat,
        state,
        validateCustomPost,
        tgChat.asyncCb(async  () => {
          const resultTextHtml = makeResultPostText(
            state.tags,
            state.useFooter,
            state.postHtmlText,
            state.footerTmplHtml
          );

          await printPostPreview(tgChat, state, resultTextHtml);

          onDone(state, resultTextHtml);
        }
      ));
    })
  );
}


async function printPostPreview(
  tgChat: TgChat,
  state: CustomPostState,
  resultTextHtml = '',
) {
  const cleanFullText = makeResultPostText(
    state.tags,
    state.useFooter,
    state.cleanPostText,
    state.cleanFooterTmpl
  )
  let detailsStr = tgChat.app.i18n.commonPhrases.linkWebPreview
    + tgChat.app.i18n.onOff[Number(state.usePreview)] + '\n'
    + tgChat.app.i18n.pageInfo.contentLength
    + ((state.useFooter) ? ` + ${tgChat.app.i18n.commonPhrases.footer}` : '')
    + `: ${cleanFullText.length}\n`
    + `${tgChat.app.i18n.pageInfo.tagsCount}: ` + state.tags.length + '\n'

  // print post preview
  await printPost(
    tgChat.botChatId,
    tgChat,
    // TODO: usePreview должно быть в приоритете - тоже проверить при финальной публикации
    (typeof state.usePreview === 'undefined')
      ? state.postAsText
      : state.usePreview,
    state.postAsText,
    state.mediaGroup,
    state.tgUrlBtn,
    resultTextHtml
  )
  // print post summary
  await tgChat.reply(detailsStr);
}


// if (state.autoDeleteTgIsoDateTime) {
//   detailsStr += tgChat.app.i18n.commonPhrases.addedDeleteTimer
//     + moment(state.autoDeleteTgIsoDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT) + '\n'
// }
// else if (state.autoDeletePeriodHours) {
//   detailsStr += tgChat.app.i18n.commonPhrases.addedDeleteTimerPeriod
//     + state.autoDeletePeriodHours + '\n'
// }

// + tgChat.app.i18n.commonPhrases.pubDate + makeHumanDateTimeStr(
//   state.pubDate!, state.pubTime!, tgChat.app.appConfig.utcOffset
// ) + '\n'

// const isPost2000 = clearText.length > TELEGRAM_MAX_CAPTION
//   && clearText.length < TELEGRAM_MAX_POST;