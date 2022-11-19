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
  if (!state.postText && !state.mediaGroup.length) {
    throw tgChat.app.i18n.errors.noImageNoText;
  }
  // if post2000 has more than one image
  else if (isPost2000 && state.mediaGroup.length > 1) {
    throw tgChat.app.i18n.message.post2000oneImg;
  }
  // if post2000 has video
  else if (isPost2000 && state.mediaGroup.length && state.mediaGroup[0].type === 'video') {
    throw tgChat.app.i18n.message.post2000video;
  }
  // if text-like post is bigger than 2048
  else if ((!state.mediaGroup.length || isPost2000) && clearText.length > TELEGRAM_MAX_POST) {
    throw tgChat.app.i18n.errors.bigPost;
  }
  // if image caption too big
  else if (state.mediaGroup.length && clearText.length > TELEGRAM_MAX_CAPTION) {
    throw tgChat.app.i18n.errors.bigCaption;
  }
}
