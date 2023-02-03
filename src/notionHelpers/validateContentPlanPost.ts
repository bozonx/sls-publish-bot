import _ from 'lodash';
import {MAX_INSTA_TAGS, TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST, WARN_SIGN} from '../types/constants.js';
import TgChat from '../apiTg/TgChat.js';
import {SN_SUPPORT_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu.js';
import ContentItem from '../types/ContentItem.js';


export function validateContentPlanPost(tgChat: TgChat, item: ContentItem, state: ContentItemState) {
  // if image based post has no image
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.reels,
  ].includes(item.type) && !state.mainImgUrl && !state.replacedMediaGroup?.length) {
    throw tgChat.app.i18n.errors.noImage
  }
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.reels,
  ].includes(item.type) && (state.replacedMediaGroup?.length || 0) > 1) {
    throw tgChat.app.i18n.errors.moreThanOneImage
  }
  else if ([
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ].includes(item.type) && !state.mainImgUrl && !state.replacedMediaGroup?.length) {
    throw tgChat.app.i18n.errors.noImages
  }
  // if no social networks to publish
  else if (!state.sns.length) {
    throw tgChat.app.i18n.errors.noSns
  }
  else if ((state.instaTags?.length || 0) > MAX_INSTA_TAGS) {
    throw tgChat.app.i18n.errors.toManyInstaTags
  }

  validateContentLengths(tgChat, item.type)

  // TODO: вобще нет текста и картинки для post2000, article и annoucement???
}


export function validateContentLengths(tgChat: TgChat, pubType: PublicationType) {
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
