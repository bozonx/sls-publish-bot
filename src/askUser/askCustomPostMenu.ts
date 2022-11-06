import TgChat from '../apiTg/TgChat';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  OK_BTN, OK_BTN_CALLBACK, PRINT_FULL_DATE_FORMAT,
} from '../types/constants';
import {addSimpleStep, makeUtcOffsetStr} from '../helpers/helpers';
import {compactUndefined} from '../lib/arrays';
import moment from 'moment';
import {askPubDate} from './askPubDate';
import {askSelectTime} from './askSelectTime';


export type CustomPostAction = 'FOOTER_SWITCH'
  | 'PREVIEW_SWITCH'
  | 'DATE_SELECT'
  | 'TIME_SELECT'
  | 'ADD_TEXT'
  | 'ADD_TAGS';

export interface CustomPostState {
  useFooter: boolean;
  usePreview: boolean;
  forceDisablePreview: boolean;
  footerTmpl?: string;
  postText?: string;
  selectedDate?: string;
  selectedTime?: string;
}

export const CUSTOM_POST_ACTION: Record<CustomPostAction, CustomPostAction> = {
  FOOTER_SWITCH: 'FOOTER_SWITCH',
  PREVIEW_SWITCH: 'PREVIEW_SWITCH',
  DATE_SELECT: 'DATE_SELECT',
  TIME_SELECT: 'TIME_SELECT',
  ADD_TEXT: 'ADD_TEXT',
  ADD_TAGS: 'ADD_TAGS',
};


export async function askCustomPostMenu(
  blogName: string,
  tgChat: TgChat,
  state: CustomPostState,
  onDone: () => void,
) {
  const msg = tgChat.app.i18n.customPost.actionMenu;
  const buttons = [
    (state.footerTmpl)
      ? [{
          text: (state.useFooter)
            ? tgChat.app.i18n.commonPhrases.noPostFooter
            : tgChat.app.i18n.commonPhrases.yesPostFooter,
          callback_data: CUSTOM_POST_ACTION.FOOTER_SWITCH,
        }]
      : [],
    (!state.forceDisablePreview)
      ? [{
        text: (state.usePreview)
          ? tgChat.app.i18n.commonPhrases.noPreview
          : tgChat.app.i18n.commonPhrases.yesPreview,
        callback_data: CUSTOM_POST_ACTION.PREVIEW_SWITCH,
      }]
      : [],
    [
      {
        text: tgChat.app.i18n.buttons.addText,
        callback_data: CUSTOM_POST_ACTION.ADD_TEXT,
      }
    ],
    [
      {
        text: tgChat.app.i18n.buttons.addText,
        callback_data: CUSTOM_POST_ACTION.ADD_TAGS,
      }
    ],
    [
      {
        text: (state.selectedDate)
          ? tgChat.app.i18n.commonPhrases.changedPubDate
            + moment(state.selectedDate).format(PRINT_FULL_DATE_FORMAT)
          : tgChat.app.i18n.commonPhrases.setPubDate,
        callback_data: CUSTOM_POST_ACTION.DATE_SELECT,
      },
      {
        text: (state.selectedTime)
          ? tgChat.app.i18n.commonPhrases.changedPubTime + state.selectedTime
          : tgChat.app.i18n.commonPhrases.setPubTime,
        callback_data: CUSTOM_POST_ACTION.TIME_SELECT,
      },
    ],
    compactUndefined([
      BACK_BTN,
      CANCEL_BTN,
      (state.selectedDate && state.selectedTime) ? OK_BTN : undefined,
    ]),
  ];

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    return handleButtons(queryData, blogName, tgChat, state, onDone);
  });
}

async function handleButtons(
  queryData: string,
  blogName: string,
  tgChat: TgChat,
  state: CustomPostState,
  onDone: () => void,
) {
  switch (queryData) {
    case BACK_BTN_CALLBACK:
      return tgChat.steps.back();
    case CANCEL_BTN_CALLBACK:
      return tgChat.steps.cancel();
    case OK_BTN_CALLBACK:
      break;
    case CUSTOM_POST_ACTION.FOOTER_SWITCH:
      break;
    case CUSTOM_POST_ACTION.PREVIEW_SWITCH:
      break;
    case CUSTOM_POST_ACTION.ADD_TEXT:
      await askPostText(blogName, tgChat, (text: string) => {
        // TODO: add
        //onDone(text);
      });
      break;
    case CUSTOM_POST_ACTION.ADD_TAGS:
      break;
    case CUSTOM_POST_ACTION.DATE_SELECT:
      await askPubDate(tgChat, tgChat.asyncCb(async (newDate: string) => {
        state.selectedDate = newDate;

        await tgChat.reply(makeDateTimeMsg(tgChat, state));

        await askMenu(blogName, tgChat, photoUrl, footerStr, newDate, selectedTime, postText, useFooter);
      }));

      break;
    case CUSTOM_POST_ACTION.TIME_SELECT:
      await askSelectTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
        state.selectedTime = newTime;

        await tgChat.reply(makeDateTimeMsg(tgChat, state));

        await askMenu(blogName, tgChat, photoUrl, footerStr, selectedDate, newTime, postText, useFooter);
      }));

      break;
    default:
      throw new Error(`Unknown action`);
  }
}

function makeDateTimeMsg(tgChat: TgChat, state: CustomPostState): string {
  const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
  const {selectedDate, selectedTime} = state;

  if (selectedDate && selectedTime) {
    return tgChat.app.i18n.commonPhrases.selectedDateAndTime
      + `${selectedDate} ${selectedTime} ${utcOffset}`
  }
  else if (selectedDate && !selectedTime) {
    return tgChat.app.i18n.commonPhrases.selectedOnlyDate
      + `${selectedDate} ${utcOffset}`
  }
  else if (!selectedDate && selectedTime) {
    return tgChat.app.i18n.commonPhrases.selectedOnlyTime
      + `${selectedTime} ${utcOffset}`
  }
  else {
    return 'None';
  }
}
