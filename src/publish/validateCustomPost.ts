import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants';
import TgChat from '../apiTg/TgChat';
import {CustomPostState} from '../askUser/askCustomPostMenu';


export default function validateCustomPost(
  state: CustomPostState,
  isPost2000: boolean,
  clearText: string,
  tgChat: TgChat
) {
  // if not text and image
  if (!state.postText && !state.images.length) {
    throw tgChat.app.i18n.message.noImageNoText;
  }
  // if post2000 has more than one image
  else if (isPost2000 && state.images.length > 1) {
    throw tgChat.app.i18n.message.post2000oneImg;
  }
  // if text-like post is bigger than 2048
  else if ((!state.images.length || isPost2000) && clearText.length > TELEGRAM_MAX_POST) {
    throw tgChat.app.i18n.message.bigPost;
  }
  // if image caption too big
  else if (state.images.length && clearText.length > TELEGRAM_MAX_CAPTION) {
    throw tgChat.app.i18n.message.bigCaption;
  }
}
