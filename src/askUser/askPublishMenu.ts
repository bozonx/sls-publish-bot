import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../types/constants';
import {addSimpleStep, makeUtcOffsetStr} from '../helpers/helpers';
import {PUBLICATION_TYPES, PublicationTypes, SN_TYPES} from '../types/ContentItem';
import {askSelectTime} from './askSelectTime';


export type PublishMenuAction = 'CHANGE_TIME'
  | 'FOOTER_SWITCH'
  | 'PREVIEW_SWITCH'
  | 'ADD_TEXT'
  | 'CHANGE_INSTA_TAGS'
  | 'CHANGE_IMAGE'
  | 'UPLOAD_MEDIA_GROUP'
  | 'CHANGE_SNS';

export interface PublishMenuState {
  pubType: PublicationTypes;
  useFooter: boolean;
  usePreview: boolean;
  sns: string[];
  selectedDate: string;
  selectedTime: string;
  mainImgUrl?: string;
  // it's for announcement
  postText?: string;
}

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
    (tgChat.app.config.blogs[blogName].sn.telegram?.postFooter && [
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
    case PUBLISH_MENU_ACTION.CHANGE_TIME:
      return await askSelectTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
        state.selectedTime = newTime;
        // print result
        await tgChat.reply(makeTimeMsg(tgChat, state));
        // print menu again
        return askPublishMenu(blogName, tgChat, state, onDone);
      }));
    case PUBLISH_MENU_ACTION.ADD_TEXT:
      // TODO: add
      break;
    case PUBLISH_MENU_ACTION.CHANGE_IMAGE:
      // TODO: add
      break;
    case PUBLISH_MENU_ACTION.UPLOAD_MEDIA_GROUP:
      // TODO: add
      break;
    case PUBLISH_MENU_ACTION.CHANGE_INSTA_TAGS:
      // TODO: add
      break;
    case PUBLISH_MENU_ACTION.CHANGE_SNS:
      // TODO: add
      break;
    default:
      throw new Error(`Unknown action`);
  }
}


function makeTimeMsg(tgChat: TgChat, state: PublishMenuState): string {
  const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);

  return tgChat.app.i18n.commonPhrases.selectedDateAndTime
    + `${state.selectedDate} ${state.selectedTime} ${utcOffset}`
}