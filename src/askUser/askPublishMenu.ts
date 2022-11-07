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
import {PUBLICATION_TYPES, PublicationTypes} from '../types/ContentItem';
import {askSelectTime} from './askSelectTime';


export type PublishMenuAction = 'CHANGE_TIME'
  | 'FOOTER_SWITCH'
  | 'PREVIEW_SWITCH'
  | 'ADD_TEXT'
  | 'CHANGE_IMAGE'
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
  CHANGE_IMAGE: 'CHANGE_IMAGE',
  CHANGE_SNS: 'CHANGE_SNS',
};


export async function askPublishMenu(
  blogName: string,
  tgChat: TgChat,
  state: PublishMenuState,
  onDone: () => void,
) {
  const msg = tgChat.app.i18n.commonPhrases.publishConfirmation;
  const buttons = [
    [
      {
        text: (state.selectedTime)
          ? tgChat.app.i18n.commonPhrases.changedPubTime + state.selectedTime
          : tgChat.app.i18n.commonPhrases.changePubTime,
        callback_data: PUBLISH_MENU_ACTION.CHANGE_TIME,
      },
    ],
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
    (state.pubType === PUBLICATION_TYPES.announcement) ? [{
      text: tgChat.app.i18n.buttons.changeText,
      callback_data: PUBLISH_MENU_ACTION.ADD_TEXT,
    }] : [],
    (![
      PUBLICATION_TYPES.poll,
      PUBLICATION_TYPES.reels,
      PUBLICATION_TYPES.video,
    ].includes(state.pubType)) ? [{
      text: (state.mainImgUrl)
        ? tgChat.app.i18n.buttons.changeMainImage
        : tgChat.app.i18n.buttons.uploadMainImage,
      callback_data: PUBLISH_MENU_ACTION.CHANGE_IMAGE,
    }] : [],
    // TODO: если впринципе доступна только 1 сеть - то не показывать кнопку
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
