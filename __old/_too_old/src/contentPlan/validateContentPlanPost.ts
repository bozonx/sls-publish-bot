import _ from 'lodash';
import {
  INSTAGRAM_MAX_POST,
  MAX_INSTA_TAGS,
  TELEGRAM_MAX_CAPTION,
  TELEGRAM_MAX_POST,
  ZEN_MAX_POST
} from '../types/constants';
import TgChat from '../apiTg/TgChat';
import {SN_TYPES, SnType} from '../types/snTypes';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType';
import {ContentItemState} from '../askUser/publishContentPlan/startPublicationMenu';
import ContentItem from '../types/ContentItem';
import {makePostFromContentItem} from './makePostFromContentItem';
import {NotionBlocks} from '../types/notion';
import {makeCleanTexts} from '../helpers/helpers';


export function validateContentPlanPost(
  tgChat: TgChat,
  blogName: string,
  item: ContentItem,
  state: ContentItemState,
  pageBlocks?: NotionBlocks
) {
  let postTexts: Partial<Record<SnType, string>> | undefined

  if (![
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.poll,
  ].includes(item.type)) {
    postTexts = makePostFromContentItem(
      state.sns,
      tgChat.app.blogs[blogName],
      item,
      state.useTgFooter,
      pageBlocks,
      state.replacedHtmlText,
      state.instaTags
    )
  }

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
  // if post2000 or announcement has video
  else if ([
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.announcement,
  ].includes(item.type)
    && state.replacedMediaGroup?.length
    && state.replacedMediaGroup[0].type === 'video'
  ) {
    throw tgChat.app.i18n.errors.videoNotSuppoerted
  }
  // no text no image
  for (const sn of state.sns) {
    if (
      [
        PUBLICATION_TYPES.post1000,
        PUBLICATION_TYPES.post2000,
        PUBLICATION_TYPES.mem,
        PUBLICATION_TYPES.photos,
        PUBLICATION_TYPES.story,
        PUBLICATION_TYPES.narrative,
        PUBLICATION_TYPES.announcement,
        PUBLICATION_TYPES.reels,
      ].includes(item.type)
      && !postTexts?.[sn as SnType] && !state.mainImgUrl && !state.replacedMediaGroup?.length
      // it only checks for tg and insta, not for blogger because it converts post to article
      && [SN_TYPES.telegram, SN_TYPES.instagram].includes(sn)
    ) {
      throw tgChat.app.i18n.errors.noImageNoText + ' - ' + sn
    }
    // if text based post has no text
    else if (
      [
        PUBLICATION_TYPES.post2000,
        PUBLICATION_TYPES.announcement,
      ].includes(item.type) && !postTexts?.[sn as SnType]
      // it only checks for tg and insta, not for blogger because it converts post to article
      && [SN_TYPES.telegram, SN_TYPES.instagram].includes(sn)
    ) {
      throw tgChat.app.i18n.errors.noText + ' - ' + sn
    }
  }

  validateContentLengths(tgChat, item.type, postTexts)
}


export function validateContentLengths(
  tgChat: TgChat,
  pubType: PublicationType,
  postTexts: Partial<Record<SnType, string>> | undefined
) {
  const cleanTexts = makeCleanTexts(postTexts)

  if (!cleanTexts) return

  if (cleanTexts?.telegram) {
    const clearText = cleanTexts.telegram!
    // if post2000 or announcement is bigger than 2048
    if ([
      PUBLICATION_TYPES.post2000,
      PUBLICATION_TYPES.announcement
    ].includes(pubType) && clearText.length > TELEGRAM_MAX_POST) {
      throw _.template(tgChat.app.i18n.errors.bigPost)({
        SN: SN_TYPES.telegram,
        COUNT: TELEGRAM_MAX_POST,
      })
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
      throw _.template(tgChat.app.i18n.errors.bigCaption)({
        SN: SN_TYPES.telegram,
        COUNT: TELEGRAM_MAX_CAPTION,
      })
    }
  }
  else if (cleanTexts?.instagram) {
    const clearText = cleanTexts.instagram

    if (clearText.length > INSTAGRAM_MAX_POST) {
      throw _.template(tgChat.app.i18n.errors.bigPost)({
        SN: SN_TYPES.instagram,
        COUNT: INSTAGRAM_MAX_POST,
      })
    }
  }
  else if (cleanTexts?.zen) {
    const clearText = cleanTexts.zen

    if (clearText.length > ZEN_MAX_POST) {
      throw _.template(tgChat.app.i18n.errors.bigPost)({
        SN: SN_TYPES.zen,
        COUNT: ZEN_MAX_POST,
      })
    }
  }

}
