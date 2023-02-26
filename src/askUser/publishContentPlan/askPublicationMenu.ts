import moment from 'moment/moment.js';
import TgChat from '../../apiTg/TgChat.js';
import {
  PRINT_SHORT_DATE_TIME_FORMAT,
  WARN_SIGN
} from '../../types/constants.js';
import {
  addHorsInDate,
  addSimpleStep, compactButtons,
  makeHumanDateTimeStr,
  makeIsoDateTimeStr
} from '../../helpers/helpers.js';
import {askTime} from '../common/askTime.js';
import {askPostMedia} from '../common/askPostMedia.js';
import {askText} from '../common/askText.js';
import {askTags} from '../common/askTags.js';
import {askSns} from '../common/askSns.js';
import {SN_TYPES, SnType} from '../../types/snTypes.js';
import {PUBLICATION_TYPES} from '../../types/publicationType.js';
import {MediaGroupItem} from '../../types/types.js';
import {TgReplyBtnUrl} from '../../types/TgReplyButton.js';
import {askUrlButton} from '../common/askUrlButton.js';
import {askTimePeriod} from '../common/askTimePeriod.js';
import {ContentItemState} from './startPublicationMenu.js';
import ContentItem from '../../types/ContentItem.js';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  makeOkBtn,
  OK_BTN_CALLBACK
} from '../../helpers/buttons.js';


export const PUBLISH_MENU_ACTION = {
  CHANGE_TIME: 'CHANGE_TIME',
  FOOTER_SWITCH: 'FOOTER_SWITCH',
  PREVIEW_SWITCH: 'PREVIEW_SWITCH',
  ADD_TEXT: 'ADD_TEXT',
  ADD_ARTICLE_ANNOUNCE: 'ADD_ARTICLE_ANNOUNCE',
  CHANGE_INSTA_TAGS: 'CHANGE_INSTA_TAGS',
  CHANGE_IMAGE: 'CHANGE_IMAGE',
  CHANGE_SNS: 'CHANGE_SNS',
  SET_AUTO_REMOVE: 'SET_AUTO_REMOVE',
  ADD_URL_BUTTON: 'ADD_URL_BUTTON',
  ONLY_MAKE_TELEGRAPH_ARTICLE: 'ONLY_MAKE_TELEGRAPH_ARTICLE',
  MAKE_ZEN_ARTICLE: 'MAKE_ZEN_ARTICLE',
}


export async function askPublicationMenu(
  blogName: string,
  tgChat: TgChat,
  state: ContentItemState,
  item: ContentItem,
  validate: (state: ContentItemState) => void,
  onDone: (action?: keyof typeof PUBLISH_MENU_ACTION) => void,
) {
  await addSimpleStep(
    tgChat,
    async () => {
      let disableOk = false

      try {
        await validate(state)
      }
      catch (e) {
        tgChat.reply(`${WARN_SIGN} ${e}`)
          .catch((e) => tgChat.log.error(e))

        disableOk = true
      }

      return [
        tgChat.app.i18n.menu.publishFromCpMenu,
        compactButtons([
          // ask time
          [
            {
              text: (state.pubTime)
                ? tgChat.app.i18n.commonPhrases.changedPubTime + state.pubTime
                : tgChat.app.i18n.commonPhrases.changePubTime,
              callback_data: PUBLISH_MENU_ACTION.CHANGE_TIME,
            },
          ],
          // ask footer
          (
            state.sns.includes(SN_TYPES.telegram)
            && state.availableTgFooter
            && ![
              PUBLICATION_TYPES.poll,
              PUBLICATION_TYPES.article
            ].includes(item.type)
          ) ? [{
            text: (state.useTgFooter)
              ? tgChat.app.i18n.commonPhrases.noTgPostFooter
              : tgChat.app.i18n.commonPhrases.yesTgPostFooter,
            callback_data: PUBLISH_MENU_ACTION.FOOTER_SWITCH,
          }] : [],
          // ask preview
          (state.sns.includes(SN_TYPES.telegram) && !state.mainImgUrl && [
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.announcement
          ].includes(item.type)) ? [{
            text: (state.usePreview)
              ? tgChat.app.i18n.commonPhrases.noTgPreview
              : tgChat.app.i18n.commonPhrases.yesTgPreview,
            callback_data: PUBLISH_MENU_ACTION.PREVIEW_SWITCH,
          }] : [],
          // ask to change post text only for announcement
          (item.type === PUBLICATION_TYPES.announcement) ? [{
            text: tgChat.app.i18n.buttons.replaceText,
            callback_data: PUBLISH_MENU_ACTION.ADD_TEXT,
          }] : [],
          // ask article announcement
          (item.type === PUBLICATION_TYPES.article) ? [{
            text: (state.articleAnnounceMd)
              ? tgChat.app.i18n.buttons.replaceArticleAnnounce
              : tgChat.app.i18n.buttons.addArticleAnnounce,
            callback_data: PUBLISH_MENU_ACTION.ADD_ARTICLE_ANNOUNCE,
          }] : [],
          // ask to change main image/video
          ([
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.mem,
            PUBLICATION_TYPES.photos,
            PUBLICATION_TYPES.story,
            PUBLICATION_TYPES.narrative,
            PUBLICATION_TYPES.announcement,
            PUBLICATION_TYPES.reels,
          ].includes(item.type)) ? [{
            text: (() => {
              if ([
                PUBLICATION_TYPES.photos,
                PUBLICATION_TYPES.narrative,
              ].includes(item.type)) {
                // plural
                return (state.mainImgUrl)
                  ? tgChat.app.i18n.buttons.changeImages
                  : tgChat.app.i18n.buttons.uploadImages
              }
              else {
                return (state.mainImgUrl)
                  ? tgChat.app.i18n.buttons.changeImage
                  : tgChat.app.i18n.buttons.uploadImage
              }
            })(),
            callback_data: PUBLISH_MENU_ACTION.CHANGE_IMAGE,
          }] : [],
          // ask to setup instagram tags
          (state.sns.includes(SN_TYPES.instagram)) ? [{
            text: tgChat.app.i18n.buttons.changeInstaTags,
            callback_data: PUBLISH_MENU_ACTION.CHANGE_INSTA_TAGS,
          }] : [],
          // ask remove or add sn
          [
            {
              text: tgChat.app.i18n.buttons.changeSns,
              callback_data: PUBLISH_MENU_ACTION.CHANGE_SNS,
            }
          ],
          // ask URL button
          (state.sns.includes(SN_TYPES.telegram) && [
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.story,
            PUBLICATION_TYPES.announcement,
          ].includes(item.type)) ? [{
            text: (state.tgUrlBtn)
              ? tgChat.app.i18n.buttons.changeTgUrlButton
              : tgChat.app.i18n.buttons.addTgUrlButton,
            callback_data: PUBLISH_MENU_ACTION.ADD_URL_BUTTON,
          }] : [],
          // ask auto remove
          (state.sns.includes(SN_TYPES.telegram) && [
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.announcement,
            PUBLICATION_TYPES.poll,
            PUBLICATION_TYPES.story,
          ].includes(item.type)) ? [{
            text: (state.autoDeleteTgIsoDateTime)
              ? tgChat.app.i18n.buttons.changeTgAutoRemove
              : tgChat.app.i18n.buttons.setTgAutoRemove,
            callback_data: PUBLISH_MENU_ACTION.SET_AUTO_REMOVE,
          }] : [],
          (
            state.sns.includes(SN_TYPES.telegram)
            && item.type === PUBLICATION_TYPES.article
          ) ? [{
            text: tgChat.app.i18n.buttons.onlyTelegraphArticle,
            callback_data: PUBLISH_MENU_ACTION.ONLY_MAKE_TELEGRAPH_ARTICLE,
          }] : [],
          (
            //state.sns.includes(SN_TYPES.zen)
            // TODO: change
            true
            && item.type === PUBLICATION_TYPES.article
          ) ? [{
            text: tgChat.app.i18n.buttons.makeZenArticle,
            callback_data: PUBLISH_MENU_ACTION.MAKE_ZEN_ARTICLE,
          }] : [],
          [
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n),
            (disableOk) ? undefined : makeOkBtn(tgChat.app.i18n),
          ],
        ])
      ]
    },
    (queryData: string) => {
      return handleButtons(queryData, blogName, tgChat, state, item, validate, onDone);
    }
  );
}


async function handleButtons(
  queryData: string,
  blogName: string,
  tgChat: TgChat,
  state: ContentItemState,
  item: ContentItem,
  validate: (state: ContentItemState) => void,
  onDone: (action?: keyof typeof PUBLISH_MENU_ACTION) => void
) {
  switch (queryData) {
    case BACK_BTN_CALLBACK:
      return tgChat.steps.back()
    case CANCEL_BTN_CALLBACK:
      return tgChat.steps.cancel()
    case OK_BTN_CALLBACK:
      return onDone()
    case PUBLISH_MENU_ACTION.FOOTER_SWITCH:
      // switch footer value
      state.useTgFooter = !state.useTgFooter
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedNoFooter
        + tgChat.app.i18n.onOff[Number(state.useTgFooter)]
      )

      // TODO: вместо этого использовать steps.to() - нверное стейт тоже сохранится
      // print menu again
      return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
    case PUBLISH_MENU_ACTION.PREVIEW_SWITCH:
      // switch footer value
      state.usePreview = !state.usePreview
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.linkWebPreview
        + tgChat.app.i18n.onOff[Number(state.usePreview)]
      )
      // print menu again
      return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
    case PUBLISH_MENU_ACTION.ADD_TEXT:
      // it's only for annoucement
      return await askText(tgChat, tgChat.asyncCb(async (textHtml?: string, cleanText?: string) => {
        state.replacedHtmlText = textHtml
        // print result
        if (state.replacedHtmlText) {
          await tgChat.reply(tgChat.app.i18n.menu.selectedPostText)
          await tgChat.reply(state.replacedHtmlText, undefined, true, true)
        }
        else {
          await tgChat.reply(tgChat.app.i18n.menu.selectedInitialPostText)
        }
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
      }), undefined, undefined, tgChat.app.i18n.buttons.getInitialNotionText);
    case PUBLISH_MENU_ACTION.ADD_ARTICLE_ANNOUNCE:
      // it's only for article
      return await askText(
        tgChat,
        tgChat.asyncCb(async (textHtml?: string, cleanText?: string) => {
          state.articleAnnounceMd = cleanText
          // print result
          if (state.articleAnnounceMd) {
            await tgChat.reply(tgChat.app.i18n.menu.selectedAnnounce)
            await tgChat.reply(state.articleAnnounceMd, undefined, true, true)
          }
          else {
            await tgChat.reply(tgChat.app.i18n.menu.notSelectedAnnounce)
          }
          // print menu again
          return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
        }),
        tgChat.app.i18n.menu.askAnnounce,
        undefined,
        tgChat.app.i18n.buttons.clearAnnouce
      )
    case PUBLISH_MENU_ACTION.CHANGE_TIME:
      return askTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
        // validate that selected date is greater than auto-delete date
        if (
          state.autoDeleteTgIsoDateTime && moment(state.autoDeleteTgIsoDateTime).unix()
          <= moment(makeIsoDateTimeStr(
            item.date,
            newTime,
            tgChat.app.appConfig.utcOffset
          )).unix()
        ) {
          await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

          return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
        }

        state.pubTime = newTime
        // print result
        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.pubDateAndTime
          + makeHumanDateTimeStr(
            item.date,
            state.pubTime,
            tgChat.app.appConfig.utcOffset
          )
        )
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
      }));
    case PUBLISH_MENU_ACTION.CHANGE_IMAGE:
      return askPostMedia(
        tgChat,
        [
          PUBLICATION_TYPES.post1000,
          PUBLICATION_TYPES.mem,
          PUBLICATION_TYPES.photos,
          PUBLICATION_TYPES.story,
          PUBLICATION_TYPES.narrative,
          PUBLICATION_TYPES.reels,
        ].includes(item.type),
        ![
          PUBLICATION_TYPES.photos,
          PUBLICATION_TYPES.narrative,
        ].includes(item.type),
        tgChat.asyncCb(async (mediaGroup: MediaGroupItem[]) => {
          if (
            [
              PUBLICATION_TYPES.post1000,
              PUBLICATION_TYPES.post2000,
              PUBLICATION_TYPES.narrative,
            ].includes(item.type)
            && mediaGroup.find((el) => el.type === 'video')
          ) {
            // only image
            await tgChat.reply(tgChat.app.i18n.errors.onlyImageAllowed)

            return
          }
          else if (
            item.type === PUBLICATION_TYPES.reels
            && mediaGroup.find((el) => el.type !== 'video')
          ) {
            // only video
            await tgChat.reply(tgChat.app.i18n.errors.onlyVideoAllowed)

            return
          }

          state.replacedMediaGroup = mediaGroup

          if (state.replacedMediaGroup.length) {
            await tgChat.reply(tgChat.app.i18n.message.mediaPlaced)
          }
          else {
            await tgChat.reply(tgChat.app.i18n.message.removedImg)
          }

          return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
        }),
        (state.mainImgUrl) ? tgChat.app.i18n.buttons.getInitialNotionImage : undefined,
      );
    case PUBLISH_MENU_ACTION.CHANGE_INSTA_TAGS:
      return await askTags(state.instaTags || [], tgChat, tgChat.asyncCb(async (newTags: string[]) => {
        state.instaTags = newTags
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
      }));
    case PUBLISH_MENU_ACTION.CHANGE_SNS:
      return await askSns(state.sns, tgChat, tgChat.asyncCb(async (newSns: SnType[]) => {
        state.sns = newSns
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
      }));
    case PUBLISH_MENU_ACTION.ADD_URL_BUTTON:
      return await askUrlButton(tgChat, tgChat.asyncCb(async (urlButton?: TgReplyBtnUrl) => {
        if (!urlButton) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedUrlButton);

          delete state.tgUrlBtn;

          return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
        }

        state.tgUrlBtn = urlButton;

        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.addedUrlButton + '\n'
          + `${urlButton.text} - ${urlButton.url}`,
          undefined,
          true
        );

        // print menu again
        return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
      }));
    case PUBLISH_MENU_ACTION.SET_AUTO_REMOVE:
      return await askTimePeriod(tgChat, tgChat.asyncCb(async (
        hoursPeriod?: number,
        certainIsoDateTime?: string
      ) => {
        if (!hoursPeriod && !certainIsoDateTime) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedDeleteTimer)

          delete state.autoDeleteTgIsoDateTime

          return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
        }

        const pubIsoDate = makeIsoDateTimeStr(
          item.date,
          state.pubTime,
          tgChat.app.appConfig.utcOffset
        )

        // validate that selected date is greater than auto-delete date
        if (
          certainIsoDateTime && moment(certainIsoDateTime).unix()
          <= moment(pubIsoDate).unix()
        ) {
          await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

          return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
        }

        if (hoursPeriod) {
          state.autoDeleteTgIsoDateTime = addHorsInDate(pubIsoDate, hoursPeriod)
        }
        else {
          state.autoDeleteTgIsoDateTime = certainIsoDateTime
        }
        // print the result
        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.addedDeleteTimer
          + moment(state.autoDeleteTgIsoDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT)
        )
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, item, validate, onDone)
      }));
    default:
      if (!Object.keys(PUBLISH_MENU_ACTION).includes(queryData)) {
        throw new Error(`Unknown action`)
      }

      // it is for ONLY_MAKE_TELEGRAPH_ARTICLE
      onDone(queryData as keyof typeof PUBLISH_MENU_ACTION)
  }
}
