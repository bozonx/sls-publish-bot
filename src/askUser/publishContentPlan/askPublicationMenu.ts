import TgChat from '../../apiTg/TgChat.js';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK, PRINT_SHORT_DATE_TIME_FORMAT
} from '../../types/constants.js';
import {addSimpleStep, makeUtcOffsetStr} from '../../helpers/helpers.js';
import {askTime} from '../common/askTime.js';
import {askPostMedia} from '../common/askPostMedia.js';
import {printImage} from '../../publish/printInfo.js';
import {askText} from '../common/askText.js';
import {askTags} from '../common/askTags.js';
import {askSns} from '../common/askSns.js';
import {SN_TYPES, SnType} from '../../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../../types/publicationType.js';
import {MediaGroupItem} from '../../types/types.js';
import {TgReplyBtnUrl, TgReplyButton} from '../../types/TgReplyButton.js';
import {CUSTOM_POST_ACTION} from '../customTgPost/askCustomPostMenu.js';
import {askUrlButton} from '../common/askUrlButton.js';
import {askTimePeriod} from '../common/askTimePeriod.js';
import moment from 'moment/moment.js';


// TODO: move state to start
export interface PublishMenuState {
  pubType: PublicationType
  useFooter: boolean
  usePreview: boolean
  sns: SnType[]
  selectedDate: string
  selectedTime: string
  instaTags?: string[]
  mainImgUrl?: string
  // it's for announcement
  postHtmlText?: string
  urlBtn?: TgReplyBtnUrl
  autoDeleteIsoDateTime?: string
  autoDeletePeriodHours?: number
}

export type PublishMenuAction = 'CHANGE_TIME'
  | 'FOOTER_SWITCH'
  | 'PREVIEW_SWITCH'
  | 'ADD_TEXT'
  | 'CHANGE_INSTA_TAGS'
  | 'CHANGE_IMAGE'
  | 'CHANGE_SNS';

export const PUBLISH_MENU_ACTION: Record<PublishMenuAction, PublishMenuAction> = {
  // TODO: наверное тут не нужно???
  CHANGE_TIME: 'CHANGE_TIME',
  FOOTER_SWITCH: 'FOOTER_SWITCH',
  PREVIEW_SWITCH: 'PREVIEW_SWITCH',
  ADD_TEXT: 'ADD_TEXT',
  CHANGE_INSTA_TAGS: 'CHANGE_INSTA_TAGS',
  CHANGE_IMAGE: 'CHANGE_IMAGE',
  CHANGE_SNS: 'CHANGE_SNS',
};


export async function askPublicationMenu(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  // TODO: а тут validate не нужен чтоли?
  onDone: () => void,
) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {

      // TODO: добавить validate и disableOk
      // TODO: mainImgUrl обязательна для некоторых типов постов, но её может сразу и не быть

      return [
        tgChat.app.i18n.menu.publishFromCpMenu,
        // TODO: use compactButtons?
        [
          // TODO: это лучше спрашивать после нажания на ок???
          // ask time
          [
            {
              text: (state.selectedTime)
                ? tgChat.app.i18n.commonPhrases.changedPubTime + state.selectedTime
                : tgChat.app.i18n.commonPhrases.changePubTime,
              callback_data: PUBLISH_MENU_ACTION.CHANGE_TIME,
            },
          ],
          // ask footer
          (tgChat.app.blogs[blogName].sn.telegram?.postFooter && ![
            // TODO: у article тоже же есть футер
            PUBLICATION_TYPES.article,
            PUBLICATION_TYPES.poll,
          ].includes(state.pubType)) ? [{
            text: (state.useFooter)
              ? tgChat.app.i18n.commonPhrases.noPostFooter
              : tgChat.app.i18n.commonPhrases.yesPostFooter,
            callback_data: PUBLISH_MENU_ACTION.FOOTER_SWITCH,
          }] : [],
          // ask preview
          (!state.mainImgUrl && [
            // TODO: а разве для post1000 картинка не обязательна?
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.announcement
          ].includes(state.pubType)) ? [{
            text: (state.usePreview)
              ? tgChat.app.i18n.commonPhrases.noPreview
              : tgChat.app.i18n.commonPhrases.yesPreview,
            callback_data: PUBLISH_MENU_ACTION.PREVIEW_SWITCH,
          }] : [],
          // ask to change post text only for announcement
          (state.pubType === PUBLICATION_TYPES.announcement) ? [{
            text: (state.postHtmlText)
              ? tgChat.app.i18n.buttons.replaceText
              : tgChat.app.i18n.buttons.addText,
            callback_data: PUBLISH_MENU_ACTION.ADD_TEXT,
          }] : [],
          // ask to change main image/video
          ([
            // TODO: нафига в статье??? там картинка должна быть просто частью статьи
            PUBLICATION_TYPES.article,
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            // TODO: добавить photos, narrative
            PUBLICATION_TYPES.announcement,
            PUBLICATION_TYPES.mem,
            PUBLICATION_TYPES.story,
            PUBLICATION_TYPES.reels,
          ].includes(state.pubType)) ? [{
            text: (state.mainImgUrl)
              // TODO: если несколько картинок то во множественном числе
              ? tgChat.app.i18n.buttons.changeMainImage
              : tgChat.app.i18n.buttons.uploadMainImage,
            callback_data: PUBLISH_MENU_ACTION.CHANGE_IMAGE,
          }] : [],
          // and to setup instagram tags
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
          ([
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.announcement,
          ].includes(state.pubType)) ? [{
            text: (state.urlBtn)
              ? tgChat.app.i18n.buttons.changeUrlButton
              : tgChat.app.i18n.buttons.addUrlButton,
            callback_data: CUSTOM_POST_ACTION.ADD_URL_BUTTON,
          }] : [],
          ([
            PUBLICATION_TYPES.post1000,
            PUBLICATION_TYPES.post2000,
            PUBLICATION_TYPES.announcement,
            PUBLICATION_TYPES.poll,
          ].includes(state.pubType)) ? [{
            text: (state.autoDeleteIsoDateTime || state.autoDeletePeriodHours)
              ? tgChat.app.i18n.buttons.changeAutoRemove
              : tgChat.app.i18n.buttons.setAutoRemove,
            callback_data: CUSTOM_POST_ACTION.SET_AUTO_REMOVE,
          }] : [],
          [
            BACK_BTN,
            CANCEL_BTN,
            OK_BTN
          ]
        ]
      ]
    },
    (queryData: string) => {
      return handleButtons(queryData, blogName, tgChat, state, onDone);
    }
  );
}


async function handleButtons(
  queryData: string,
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  onDone: () => void,
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
      state.useFooter = !state.useFooter
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedNoFooter
        + tgChat.app.i18n.onOff[Number(state.useFooter)]
      )

      // TODO: вместо этого использовать steps.to() - нверное стейт тоже сохранится
      // print menu again
      return askPublicationMenu(blogName, tgChat, state, onDone)
    case PUBLISH_MENU_ACTION.PREVIEW_SWITCH:
      // switch footer value
      state.usePreview = !state.usePreview
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.linkWebPreview
        + tgChat.app.i18n.onOff[Number(state.usePreview)]
      )
      // print menu again
      return askPublicationMenu(blogName, tgChat, state, onDone)
    case PUBLISH_MENU_ACTION.ADD_TEXT:
      return await askText(tgChat, tgChat.asyncCb(async (textHtml?: string, cleanText?: string) => {

        // TODO: есть ещё cleanText - что с ним делать???

        state.postHtmlText = textHtml
        // print result
        if (state.postHtmlText) {
          await tgChat.reply(tgChat.app.i18n.menu.selectedPostText)
          await tgChat.reply(state.postHtmlText, undefined, true, true)
        }
        else {
          await tgChat.reply(tgChat.app.i18n.menu.selectedNoPostText)
        }
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, onDone)
      }));
    case PUBLISH_MENU_ACTION.CHANGE_TIME:

      // TODO: review
      // TODO: сделать валидацию - сравнить с временем автоудаления

      return askTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
        state.selectedTime = newTime;

        const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
        // print result
        await tgChat.reply(tgChat.app.i18n.commonPhrases.pubDateAndTime
          + `${state.selectedDate} ${state.selectedTime} ${utcOffset}`);
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, onDone);
      }));
    case PUBLISH_MENU_ACTION.CHANGE_IMAGE:

      // TODO: review
      // TODO: нельзя видео - post2000, article, narrative
      // TODO: нельзя фото - reels

      return askPostMedia(
        tgChat,
        [
          PUBLICATION_TYPES.mem,
          PUBLICATION_TYPES.story,
          PUBLICATION_TYPES.reels,
        ].includes(state.pubType),
        true,
        tgChat.asyncCb(async (mediaGroup: MediaGroupItem[], caption?: string) => {
          if (mediaGroup.length) {
            // TODO: может быть и не url
            //state.mainImgUrl = mediaGroup[0].url;

            // TODO: поддержка видео

            await printImage(tgChat, state.mainImgUrl);
          }
          else {
            delete state.mainImgUrl;

            await tgChat.reply(tgChat.app.i18n.message.removedImg);
          }

          return askPublicationMenu(blogName, tgChat, state, onDone);
        })
      );
    case PUBLISH_MENU_ACTION.CHANGE_INSTA_TAGS:
      return await askTags(state.instaTags || [], tgChat, tgChat.asyncCb(async (newTags: string[]) => {
        state.instaTags = newTags
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, onDone)
      }));
    case PUBLISH_MENU_ACTION.CHANGE_SNS:
      return await askSns(state.sns, tgChat, tgChat.asyncCb(async (newSns: SnType[]) => {
        state.sns = newSns
        // print menu again
        return askPublicationMenu(blogName, tgChat, state, onDone)
      }));
    case CUSTOM_POST_ACTION.ADD_URL_BUTTON:
      return await askUrlButton(tgChat, tgChat.asyncCb(async (urlButton?: TgReplyBtnUrl) => {
        if (!urlButton) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedUrlButton);

          delete state.urlBtn;

          return askPublicationMenu(blogName, tgChat, state, onDone)
        }

        state.urlBtn = urlButton;

        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.addedUrlButton + '\n'
          + `${urlButton.text} - ${urlButton.url}`,
          undefined,
          true
        );

        // print menu again
        return askPublicationMenu(blogName, tgChat, state, onDone)
      }));
    case CUSTOM_POST_ACTION.SET_AUTO_REMOVE:
      return await askTimePeriod(tgChat, tgChat.asyncCb(async (
        hoursPeriod?: number,
        certainIsoDateTime?: string
      ) => {
        if (!hoursPeriod && !certainIsoDateTime) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedDeleteTimer);

          delete state.autoDeleteIsoDateTime;

          return askPublicationMenu(blogName, tgChat, state, onDone)
        }

        // TODO: сразу преобразовать период во время - время поста то сразу известно
        // TODO: сразу сделать валидацию - время поста то сразу известно

        state.autoDeleteIsoDateTime = certainIsoDateTime
        state.autoDeletePeriodHours = hoursPeriod

        if (state.autoDeleteIsoDateTime) {
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.addedDeleteTimer
            + moment(state.autoDeleteIsoDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT)
          )
        }
        else if (state.autoDeletePeriodHours) {
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.addedDeleteTimerPeriod
            + state.autoDeletePeriodHours
          )
        }

        // print menu again
        return askPublicationMenu(blogName, tgChat, state, onDone)
      }));
    default:
      throw new Error(`Unknown action`);
  }
}
