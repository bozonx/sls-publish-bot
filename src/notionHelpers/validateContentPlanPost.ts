import _ from 'lodash';
import {TELEGRAM_MAX_CAPTION, TELEGRAM_MAX_POST, WARN_SIGN} from '../types/constants.js';
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

  validateContentPlanPostText(tgChat, item.type, )

  // TODO: наверное тут же вызывать validateContentPlanPostText
  // TODO: проверка длинн
  // TODO: CHANGE_INSTA_TAGS too many - 30
  // TODO: вобще нет текста и картинки для post2000, article и annoucement???
  // TODO: поидее ещё есть у каждого блога поддерживаемые типы публикаций

  // check publication type need to be supported by social network
  for (const sn of state.sns) {
    const types = SN_SUPPORT_TYPES[sn]

    if (types.indexOf(item.type) === -1) {
      throw _.template(tgChat.app.i18n.errors.unsupportedPubType)({
        SN: sn,
        PUB_TYPE: item.type,
      })
    }
  }
}


export function validateContentPlanPostText(tgChat: TgChat, pubType: PublicationType) {
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
