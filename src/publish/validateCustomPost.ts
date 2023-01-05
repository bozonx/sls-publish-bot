import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants.js';
import TgChat from '../apiTg/TgChat.js';
import {CustomPostState} from '../askUser/customTgPost/askCustomPostMenu.js';
import {clearMdText} from '../helpers/helpers.js';


export default function validateCustomPost(
  state: CustomPostState,
  postAsText: boolean,
  resultText: string,
  tgChat: TgChat
) {
  const clearText = clearMdText(resultText);
  // if not text and image
  if (!state.postText && !state.mediaGroup.length) {
    throw tgChat.app.i18n.errors.noImageNoText;
  }
  // if post2000 has more than one image
  else if (postAsText && state.mediaGroup.length > 1) {
    throw tgChat.app.i18n.message.post2000oneImg;
  }
  // if post2000 has video
  else if (postAsText && state.mediaGroup.length && state.mediaGroup[0].type === 'video') {
    throw tgChat.app.i18n.message.post2000video;
  }
  // if text-like post is bigger than 2048
  else if ((!state.mediaGroup.length || postAsText) && clearText.length > TELEGRAM_MAX_POST) {
    throw tgChat.app.i18n.errors.bigPost;
  }
  // if image caption too big
  else if (state.mediaGroup.length && clearText.length > TELEGRAM_MAX_CAPTION) {
    throw tgChat.app.i18n.errors.bigCaption;
  }
}
