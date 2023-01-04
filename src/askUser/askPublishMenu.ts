import TgChat from '../apiTg/TgChat.js';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../types/constants.js';
import {addSimpleStep, makeUtcOffsetStr} from '../helpers/helpers.js';
import {askTime} from './common/askTime.js';
import {askPostMedia} from './common/askPostMedia.js';
import {printImage} from '../publish/printInfo.js';
import {askPostText} from './common/askPostText.js';
import {askTags} from './common/askTags.js';
import {askSns} from './common/askSns.js';
import {SN_TYPES, SnType} from '../types/snTypes.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';
import {MediaGroupItem} from '../types/types.js';


export interface PublishMenuState {
  pubType: PublicationType;
  useFooter: boolean;
  usePreview: boolean;
  sns: SnType[];
  selectedDate: string;
  selectedTime: string;
  instaTags?: string[];
  mainImgUrl?: string;
  // it's for announcement
  postText?: string;
}

export type PublishMenuAction = 'CHANGE_TIME'
  | 'FOOTER_SWITCH'
  | 'PREVIEW_SWITCH'
  | 'ADD_TEXT'
  | 'CHANGE_INSTA_TAGS'
  | 'CHANGE_IMAGE'
  | 'UPLOAD_MEDIA_GROUP'
  | 'CHANGE_SNS';

export const PUBLISH_MENU_ACTION: Record<PublishMenuAction, PublishMenuAction> = {
  CHANGE_TIME: 'CHANGE_TIME',
  FOOTER_SWITCH: 'FOOTER_SWITCH',
  PREVIEW_SWITCH: 'PREVIEW_SWITCH',
  ADD_TEXT: 'ADD_TEXT',
  CHANGE_INSTA_TAGS: 'CHANGE_INSTA_TAGS',
  CHANGE_IMAGE: 'CHANGE_IMAGE',
  UPLOAD_MEDIA_GROUP: 'UPLOAD_MEDIA_GROUP',
  CHANGE_SNS: 'CHANGE_SNS',
};


export async function askPublishMenu(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  onDone: () => void,
) {
  const msg = tgChat.app.i18n.menu.publishFromCpMenu;
  const buttons = [
    // ask time
    [
      {
        text: (state.selectedTime)
          ? tgChat.app.i18n.commonPhrases.changedPubTime + state.selectedTime
          : tgChat.app.i18n.commonPhrases.changePubTime,
        callback_data: PUBLISH_MENU_ACTION.CHANGE_TIME,
      },
    ],
    // ask preview
    (!state.mainImgUrl && [
      PUBLICATION_TYPES.post1000,
      PUBLICATION_TYPES.post2000,
      PUBLICATION_TYPES.announcement
    ].includes(state.pubType)) ? [{
      text: (state.usePreview)
        ? tgChat.app.i18n.commonPhrases.noPreview
        : tgChat.app.i18n.commonPhrases.yesPreview,
      callback_data: PUBLISH_MENU_ACTION.PREVIEW_SWITCH,
    }] : [],
    // ask footer
    (tgChat.app.blogs[blogName].sn.telegram?.postFooter && [
      PUBLICATION_TYPES.post1000,
      PUBLICATION_TYPES.post2000,
      PUBLICATION_TYPES.mem,
      PUBLICATION_TYPES.photos,
      PUBLICATION_TYPES.story,
      PUBLICATION_TYPES.narrative,
      PUBLICATION_TYPES.announcement,
      PUBLICATION_TYPES.reels,
      PUBLICATION_TYPES.video,
    ].includes(state.pubType)) ? [{
      text: (state.useFooter)
        ? tgChat.app.i18n.commonPhrases.noPostFooter
        : tgChat.app.i18n.commonPhrases.yesPostFooter,
      callback_data: PUBLISH_MENU_ACTION.FOOTER_SWITCH,
    }] : [],
    // ask to change post text only for announcement
    (state.pubType === PUBLICATION_TYPES.announcement) ? [{
      text: tgChat.app.i18n.buttons.changeText,
      callback_data: PUBLISH_MENU_ACTION.ADD_TEXT,
    }] : [],
    // ask to change main image/video
    ([
      PUBLICATION_TYPES.article,
      PUBLICATION_TYPES.post1000,
      PUBLICATION_TYPES.post2000,
      PUBLICATION_TYPES.mem,
      PUBLICATION_TYPES.story,
      PUBLICATION_TYPES.announcement,
      PUBLICATION_TYPES.reels,
    ].includes(state.pubType)) ? [{
      text: (state.mainImgUrl)
        ? tgChat.app.i18n.buttons.changeMainImage
        : tgChat.app.i18n.buttons.uploadMainImage,
      callback_data: PUBLISH_MENU_ACTION.CHANGE_IMAGE,
    }] : [],
    // ask to upload several images for photos and narrative
    ([
      PUBLICATION_TYPES.photos,
      PUBLICATION_TYPES.narrative,
    ].includes(state.pubType)) ? [{
      text: tgChat.app.i18n.buttons.uploadMediaGroup,
      callback_data: PUBLISH_MENU_ACTION.UPLOAD_MEDIA_GROUP,
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
    [
      BACK_BTN,
      CANCEL_BTN,
      OK_BTN
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,(queryData: string) => {
    return handleButtons(queryData, blogName, tgChat, state, onDone);
  });
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
      return tgChat.steps.back();
    case CANCEL_BTN_CALLBACK:
      return tgChat.steps.cancel();
    case OK_BTN_CALLBACK:
      return onDone();
    case PUBLISH_MENU_ACTION.FOOTER_SWITCH:
      // switch footer value
      state.useFooter = !state.useFooter;
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedNoFooter
        + tgChat.app.i18n.onOff[Number(state.useFooter)]
      );
      // print menu again
      return askPublishMenu(blogName, tgChat, state, onDone);
    case PUBLISH_MENU_ACTION.PREVIEW_SWITCH:
      // switch footer value
      state.usePreview = !state.usePreview;
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedNoPreview
        + tgChat.app.i18n.onOff[Number(state.usePreview)]
      );
      // print menu again
      return askPublishMenu(blogName, tgChat, state, onDone);
    case PUBLISH_MENU_ACTION.ADD_TEXT:
      return await askPostText(blogName, tgChat, tgChat.asyncCb(async (text?: string) => {
        state.postText = text;
        // print result
        if (state.postText) {
          await tgChat.reply(
            tgChat.app.i18n.menu.selectedPostText + '\n' + state.postText
          );
        }
        else {
          await tgChat.reply(tgChat.app.i18n.menu.selectedNoPostText);
        }

        // print menu again
        return askPublishMenu(blogName, tgChat, state, onDone);
      }));
    case PUBLISH_MENU_ACTION.CHANGE_TIME:
      return askTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
        state.selectedTime = newTime;

        const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
        // print result
        await tgChat.reply(tgChat.app.i18n.commonPhrases.pubDateAndTime
          + `${state.selectedDate} ${state.selectedTime} ${utcOffset}`);
        // print menu again
        return askPublishMenu(blogName, tgChat, state, onDone);
      }));
    case PUBLISH_MENU_ACTION.CHANGE_IMAGE:

      // TODO: нельзя видео - post2000, article, narrative
      // TODO: нельзя фото - reels

      return askPostMedia(
        [
          PUBLICATION_TYPES.mem,
          PUBLICATION_TYPES.story,
          PUBLICATION_TYPES.reels,
        ].includes(state.pubType),
        true,
        blogName,
        tgChat,
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

          return askPublishMenu(blogName, tgChat, state, onDone);
        })
      );
    case PUBLISH_MENU_ACTION.UPLOAD_MEDIA_GROUP:
      // TODO: add
      break;
    case PUBLISH_MENU_ACTION.CHANGE_INSTA_TAGS:
      return await askTags(state.instaTags || [], tgChat, tgChat.asyncCb(async (newTags: string[]) => {
        state.instaTags = newTags;
        // print menu again
        return askPublishMenu(blogName, tgChat, state, onDone);
      }));
    case PUBLISH_MENU_ACTION.CHANGE_SNS:
      return await askSns(state.sns, tgChat, tgChat.asyncCb(async (newSns: SnType[]) => {
        state.sns = newSns;
        // print menu again
        return askPublishMenu(blogName, tgChat, state, onDone);
      }));
    default:
      throw new Error(`Unknown action`);
  }
}
