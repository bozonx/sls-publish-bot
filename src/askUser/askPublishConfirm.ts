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
import {compactUndefined} from '../lib/arrays';


export type PublishConfirmAction = 'OK' | 'CHANGE_TIME' | 'NO_POST_FOOTER' | 'NO_PREVIEW';

export const PUBLISH_CONFIRM_ACTION: Record<PublishConfirmAction, PublishConfirmAction> = {
  OK: 'OK',
  CHANGE_TIME: 'CHANGE_TIME',
  NO_POST_FOOTER: 'NO_POST_FOOTER',
  NO_PREVIEW: 'NO_PREVIEW',
};


export async function askPublishConfirm(
  blogName: string,
  tgChat: TgChat,
  onDone: (action: PublishConfirmAction) => void,
  allowPreview: boolean,
  allowFooter: boolean,
  correctedTime?: string,
) {
  const msg = tgChat.app.i18n.menu.publishConfirmation;
  const buttons = [
    [
      {
        text: (allowPreview)
          ? tgChat.app.i18n.menu.noPreview
          : tgChat.app.i18n.menu.yesPreview,
        callback_data: PUBLISH_CONFIRM_ACTION.NO_PREVIEW,
      },
    ],
    compactUndefined([
      {
        text: (correctedTime)
          ? tgChat.app.i18n.menu.changedPostTime + correctedTime
          : tgChat.app.i18n.menu.changePostTime,
        callback_data: PUBLISH_CONFIRM_ACTION.CHANGE_TIME,
      },
      (tgChat.app.config.blogs[blogName].sn.telegram?.postFooter)
        ? {
          text: (allowFooter)
            ? tgChat.app.i18n.menu.noPostFooter
            : tgChat.app.i18n.menu.yesPostFooter,
          callback_data: PUBLISH_CONFIRM_ACTION.NO_POST_FOOTER,
        }
        : undefined,
    ]),
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
      onDone(PUBLISH_CONFIRM_ACTION.OK);
    }
    else if (queryData === PUBLISH_CONFIRM_ACTION.CHANGE_TIME) {
      onDone(PUBLISH_CONFIRM_ACTION.CHANGE_TIME);
    }
    else if (queryData === PUBLISH_CONFIRM_ACTION.NO_POST_FOOTER) {
      onDone(PUBLISH_CONFIRM_ACTION.NO_POST_FOOTER);
    }
    else if (queryData === PUBLISH_CONFIRM_ACTION.NO_PREVIEW) {
      onDone(PUBLISH_CONFIRM_ACTION.NO_PREVIEW);
    }
  });
}
