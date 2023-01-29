import _ from 'lodash';
import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST} from '../types/constants.js';
import TgChat from '../apiTg/TgChat.js';
import {SN_SUPPORT_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {PublishMenuState} from '../askUser/publishContentPlan/startPublicationMenu.js';


export default function validateContentPlanPost(state: PublishMenuState, tgChat: TgChat) {

  // TODO: photos, narrative - должны иметь 1 или более картинок

  // if image based post has no image
  if ([
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.reels,
  ].includes(state.pubType) && !state.mainImgUrl) {
    throw tgChat.app.i18n.errors.noImage;
  }
  // if no social networks to publish
  else if (!state.sns.length) {
    throw tgChat.app.i18n.errors.noSns;
  }

  // check publication type need to be supported by social network
  for (const sn of state.sns) {
    const types = SN_SUPPORT_TYPES[sn];

    if (types.indexOf(state.pubType) === -1) {
      throw _.template(tgChat.app.i18n.errors.unsupportedPubType)({
        SN: sn,
        PUB_TYPE: state.pubType,
      });
    }
  }
}


export function validateContentPlanPostText(
  clearTexts: Record<SnType, string>,
  pubType: PublicationType,
  tgChat: TgChat
) {
  for (const sn of Object.keys(clearTexts) as SnType[]) {
    const clearText = clearTexts[sn];
    // if post2000 or announcement is bigger than 2048
    if ([
      PUBLICATION_TYPES.post2000,
      PUBLICATION_TYPES.announcement
    ].includes(pubType) && clearText.length > TELEGRAM_MAX_POST) {
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
    ].includes(pubType) && clearText.length > TELEGRAM_MAX_CAPTION) {
      throw tgChat.app.i18n.errors.bigCaption;
    }
    // if text based post has no text
    else if ([
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.post1000,
      PUBLICATION_TYPES.post2000,
      PUBLICATION_TYPES.announcement,
    ].includes(pubType) && !clearText) {
      throw tgChat.app.i18n.errors.noText;
    }
  }
}
