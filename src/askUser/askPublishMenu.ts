import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN,
  OK_BTN_CALLBACK
} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';
import {PUBLICATION_TYPES, PublicationTypes} from '../types/ContentItem';


export type PublishMenuAction = 'CHANGE_TIME' | 'NO_POST_FOOTER' | 'NO_PREVIEW';

export interface PublishMenuState {
  pubType: PublicationTypes;
  useFooter: boolean;
  usePreview: boolean;
  sns: string[];
  selectedTime?: string;
  mainImgUrl?: string;
  // it's for announcement
  postText?: string;
}

export const PUBLISH_MENU_ACTION: Record<PublishMenuAction, PublishMenuAction> = {
  CHANGE_TIME: 'CHANGE_TIME',
  NO_POST_FOOTER: 'NO_POST_FOOTER',
  NO_PREVIEW: 'NO_PREVIEW',
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
    ].includes(state.pubType))
      ? [{
          text: (state.usePreview)
            ? tgChat.app.i18n.commonPhrases.noPreview
            : tgChat.app.i18n.commonPhrases.yesPreview,
          callback_data: PUBLISH_MENU_ACTION.NO_PREVIEW,
        }]
      : [],
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
    ].includes(state.pubType))
      ? [{
        text: (state.useFooter)
          ? tgChat.app.i18n.commonPhrases.noPostFooter
          : tgChat.app.i18n.commonPhrases.yesPostFooter,
        callback_data: PUBLISH_MENU_ACTION.NO_POST_FOOTER,
      }]
      : [],
    [
      BACK_BTN,
      CANCEL_BTN,
      OK_BTN
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,(queryData: string) => {
    if (queryData === BACK_BTN_CALLBACK) {
      return tgChat.steps.back();
    }
    else if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    else if (queryData === OK_BTN_CALLBACK) {
      //onDone(PUBLISH_MENU_ACTION.OK);
    }
    else if (queryData === PUBLISH_MENU_ACTION.CHANGE_TIME) {
      //onDone(PUBLISH_MENU_ACTION.CHANGE_TIME);
    }
    else if (queryData === PUBLISH_MENU_ACTION.NO_POST_FOOTER) {
      //onDone(PUBLISH_MENU_ACTION.NO_POST_FOOTER);
    }
    else if (queryData === PUBLISH_MENU_ACTION.NO_PREVIEW) {
      //onDone(PUBLISH_MENU_ACTION.NO_PREVIEW);
    }
  });
}
