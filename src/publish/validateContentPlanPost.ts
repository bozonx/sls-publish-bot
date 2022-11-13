import _ from 'lodash';
import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants';
import TgChat from '../apiTg/TgChat';
import {PublishMenuState} from '../askUser/askPublishMenu';
import {PUBLICATION_TYPES} from '../types/ContentItem';
import {SN_SUPPORT_TYPES} from '../types/SnTypes';


export default function validateContentPlanPost(
  state: PublishMenuState,
  tgChat: TgChat
) {
  // TODO: photos, narrative - должны иметь 1 или более картинок
  // TODO: если не получилось распознать картинку - то нужно запретить публикацию

  // TODO: результирующий текст даже с футером. Включая статью
  // TODO: для каждой соц сети же будет свой текст !!!!!
  const clearText = state.postText || '';

  // if image based post has no image
  if ([
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.reels,
  ].includes(state.pubType) && !state.mainImgUrl) {
    throw tgChat.app.i18n.errors.noImage;
  }
  // if text based post has no text
  else if ([
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.announcement,
  ].includes(state.pubType) && !clearText) {
    throw tgChat.app.i18n.errors.noText;
  }
  // if no social networks to publish
  else if (!state.sns.length) {
    throw tgChat.app.i18n.errors.noSns;
  }
  // if post2000 or announcement is bigger than 2048
  else if ([
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.announcement
  ].includes(state.pubType) && clearText.length > TELEGRAM_MAX_POST) {
    throw tgChat.app.i18n.errors.bigPost;
  }
  // if image caption too big
  else if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.narrative,
    PUBLICATION_TYPES.reels,
  ].includes(state.pubType) && clearText.length > TELEGRAM_MAX_CAPTION) {
    throw tgChat.app.i18n.errors.bigCaption;
  }

  // check publication type need to be supported by social network
  for (const sn of state.sns) {
    const types = SN_SUPPORT_TYPES[sn];

    if (!types.indexOf(state.pubType)) {
      throw _.template(tgChat.app.i18n.errors.unsupportedPubType)({
        SN: sn,
        PUB_TYPE: state.pubType,
      });
    }
  }
}
