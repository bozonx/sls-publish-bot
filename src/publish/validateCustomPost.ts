import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants.js';
import TgChat from '../apiTg/TgChat.js';
import {clearMdText, makeResultPostText} from '../helpers/helpers.js';
import {CustomPostState} from '../askUser/customTgPost/askCustomPostTg.js';


export default function validateCustomPost(state: CustomPostState, tgChat: TgChat) {
  const resultText = makeResultPostText(state.tags, state.useFooter, state.postText, state.footerTmpl);
  const clearText = clearMdText(resultText);
  // if no text and image
  if (!state.postText && !state.mediaGroup.length) {
    throw tgChat.app.i18n.errors.noImageNoText;
  }
  // if post as image or video but there is no image or video
  else if (!state.postAsText && !state.mediaGroup.length) {
    throw tgChat.app.i18n.errors.noImage;
  }
  // if post2000 has more than one image
  else if (state.postAsText && state.mediaGroup.length > 1) {
    throw tgChat.app.i18n.message.post2000oneImg;
  }

  // TODO: проверить onlyOneImage

  // if post2000 has video
  else if (state.postAsText && state.mediaGroup.length && state.mediaGroup[0].type === 'video') {
    throw tgChat.app.i18n.message.post2000video;
  }
  // if text-like post is bigger than 2048
  else if (state.postAsText && clearText.length > TELEGRAM_MAX_POST) {
    throw tgChat.app.i18n.errors.bigPost;
  }
  // if image caption too big
  else if (!state.postAsText && clearText.length > TELEGRAM_MAX_CAPTION) {
    throw tgChat.app.i18n.errors.bigCaption;
  }
}
