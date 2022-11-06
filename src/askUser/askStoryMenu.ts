import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN, OK_BTN_CALLBACK, PRINT_FULL_DATE_FORMAT,
} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';
import {compactUndefined} from '../lib/arrays';
import moment from 'moment';


export type StoryMenuAction = 'FOOTER_SWITCH' | 'DATE_SELECT' | 'TIME_SELECT' | 'ADD_TEXT';

export const STORY_MENU_ACTION: Record<StoryMenuAction, StoryMenuAction> = {
  //OK: 'OK',
  FOOTER_SWITCH: 'FOOTER_SWITCH',
  DATE_SELECT: 'DATE_SELECT',
  TIME_SELECT: 'TIME_SELECT',
  ADD_TEXT: 'ADD_TEXT',
};


export async function askStoryMenu(
  blogName: string,
  tgChat: TgChat,
  onDone: (action: StoryMenuAction | typeof OK_BTN_CALLBACK) => void,
  useFooter: boolean,
  correctedDate?: string,
  correctedTime?: string,
) {
  const msg = tgChat.app.i18n.story.actionMenu;
  const buttons = [
    (tgChat.app.config.blogs[blogName].sn.telegram?.postFooter)
      ? [{
          text: (useFooter)
            ? tgChat.app.i18n.commonPhrases.noPostFooter
            : tgChat.app.i18n.commonPhrases.yesPostFooter,
          callback_data: STORY_MENU_ACTION.FOOTER_SWITCH,
        }]
      : [],
    [
      {
        text: tgChat.app.i18n.menu.btnAddText,
        callback_data: STORY_MENU_ACTION.ADD_TEXT,
      }
    ],
    [
      {
        text: (correctedDate)
          ? tgChat.app.i18n.commonPhrases.changedPubDate
            + moment(correctedDate).format(PRINT_FULL_DATE_FORMAT)
          : tgChat.app.i18n.commonPhrases.setPubDate,
        callback_data: STORY_MENU_ACTION.DATE_SELECT,
      },
      {
        text: (correctedTime)
          ? tgChat.app.i18n.commonPhrases.changedPubTime + correctedTime
          : tgChat.app.i18n.commonPhrases.setPubTime,
        callback_data: STORY_MENU_ACTION.TIME_SELECT,
      },
    ],
    compactUndefined([
      BACK_BTN,
      CANCEL_BTN,
      (correctedDate && correctedTime) ? OK_BTN : undefined,
    ]),
  ];

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if (queryData === BACK_BTN_CALLBACK) {
      return tgChat.steps.back();
    }
    else if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    // else if (queryData === STORY_MENU_ACTION.ADD_TEXT) {
    //   await askPostText(blogName, tgChat, (text: string) => {
    //     // TODO: add
    //     //onDone(text);
    //   });
    // }
    else {
      onDone(queryData as StoryMenuAction);
    }
  });
}
