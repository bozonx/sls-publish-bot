import moment from 'moment';
import {compactUndefined} from 'squidlet-lib';
import TgChat from '../../apiTg/TgChat';
import {PRINT_SHORT_DATE_TIME_FORMAT, WARN_SIGN} from '../../types/constants';
import {addSimpleStep} from '../../helpers/helpers';
import {askText} from '../common/askText';
import {askTags} from '../common/askTags';
import {TgReplyBtnUrl, TgReplyButton} from '../../types/TgReplyButton';
import {askUrlButton} from '../common/askUrlButton';
import {CustomPostState} from './askCustomPostTg';
import {askTimePeriod} from '../common/askTimePeriod';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn, makeOkBtn,
  OK_BTN_CALLBACK
} from '../../helpers/buttons';


export const CUSTOM_POST_ACTION = {
  FOOTER_SWITCH: 'FOOTER_SWITCH',
  PREVIEW_SWITCH: 'PREVIEW_SWITCH',
  DATE_SELECT: 'DATE_SELECT',
  TIME_SELECT: 'TIME_SELECT',
  ADD_TEXT: 'ADD_TEXT',
  ADD_TAGS: 'ADD_TAGS',
  ADD_URL_BUTTON: 'ADD_URL_BUTTON',
  SET_AUTO_REMOVE: 'SET_AUTO_REMOVE',
};


export async function askCustomPostMenu(
  blogName: string,
  tgChat: TgChat,
  state: CustomPostState,
  validate: (tgChat: TgChat, state: CustomPostState) => void,
  onDone: () => void,
) {
  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      let disableOk = false;

      try {
        validate(tgChat, state);
      }
      catch (e) {
        tgChat.reply(`${WARN_SIGN} ${e}`)
          .catch((e) => tgChat.log.error(e));

        disableOk = true
      }

      return [
        tgChat.app.i18n.customPost.actionMenu,
        [
          (!state.forceDisableFooter) ? [{
            text: (state.useFooter)
              ? tgChat.app.i18n.commonPhrases.noTgPostFooter
              : tgChat.app.i18n.commonPhrases.yesTgPostFooter,
            callback_data: CUSTOM_POST_ACTION.FOOTER_SWITCH,
          }] : [],
          (!state.mediaGroup.length) ? [{
            text: (state.usePreview)
              ? tgChat.app.i18n.commonPhrases.noTgPreview
              : tgChat.app.i18n.commonPhrases.yesTgPreview,
            callback_data: CUSTOM_POST_ACTION.PREVIEW_SWITCH,
          }] : [],
          compactUndefined([
            {
              text: (state.postHtmlText)
                ? tgChat.app.i18n.buttons.replaceText
                : tgChat.app.i18n.buttons.addText,
              callback_data: CUSTOM_POST_ACTION.ADD_TEXT,
            },
            (state.disableTags || !state.useFooter) ? undefined : {
              text: (state.tags.length)
                ? tgChat.app.i18n.buttons.replaceTags
                : tgChat.app.i18n.buttons.addTags,
              callback_data: CUSTOM_POST_ACTION.ADD_TAGS,
            },
          ]),
          compactUndefined([
            (state.onlyOneImage) ? {
              text: (state.tgUrlBtn)
                ? tgChat.app.i18n.buttons.changeTgUrlButton
                : tgChat.app.i18n.buttons.addTgUrlButton,
              callback_data: CUSTOM_POST_ACTION.ADD_URL_BUTTON,
            } : undefined,
          ]),
          [
            {
              text: (state.autoDeleteTgIsoDateTime || state.autoDeletePeriodHours)
                ? tgChat.app.i18n.buttons.changeTgAutoRemove
                : tgChat.app.i18n.buttons.setTgAutoRemove,
              callback_data: CUSTOM_POST_ACTION.SET_AUTO_REMOVE,
            },
          ],
          compactUndefined([
            makeBackBtn(tgChat.app.i18n),
            makeCancelBtn(tgChat.app.i18n),
            (disableOk) ? undefined : makeOkBtn(tgChat.app.i18n),
          ]),
        ]
      ]
    },
    async (queryData: string) => {
      return handleButtons(queryData, blogName, tgChat, state, validate, onDone);
    }
  );
}


async function handleButtons(
  queryData: string,
  blogName: string,
  tgChat: TgChat,
  state: CustomPostState,
  validate: (tgChat: TgChat, state: CustomPostState) => void,
  onDone: () => void,
) {
  switch (queryData) {
    case BACK_BTN_CALLBACK:
      return tgChat.steps.back();
    case CANCEL_BTN_CALLBACK:
      return tgChat.steps.cancel();
    case OK_BTN_CALLBACK:
      // TODO: наверное лучше отдавать копию стейта
      return onDone();
    case CUSTOM_POST_ACTION.FOOTER_SWITCH:
      // switch footer value
      state.useFooter = !state.useFooter;
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.selectedNoFooter
        + tgChat.app.i18n.onOff[Number(state.useFooter)]
      );

      // TODO: вместо этого использовать steps.to() - нверное стейт тоже сохранится
      // print menu again
      return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
    case CUSTOM_POST_ACTION.PREVIEW_SWITCH:
      // switch footer value
      state.usePreview = !state.usePreview;
      // print result
      await tgChat.reply(
        tgChat.app.i18n.commonPhrases.linkWebPreview
        + tgChat.app.i18n.onOff[Number(state.usePreview)]
      );
      // print menu again
      return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
    case CUSTOM_POST_ACTION.ADD_TEXT:
      return await askText(tgChat, tgChat.asyncCb(async (textHtml?: string, cleanText?: string) => {
        state.postHtmlText = textHtml
        state.cleanPostText = cleanText
        // print result
        if (state.postHtmlText) {
          await tgChat.reply(tgChat.app.i18n.menu.selectedPostText);
          await tgChat.reply(state.postHtmlText, undefined, true, true);
        }
        else {
          await tgChat.reply(tgChat.app.i18n.menu.selectedNoPostText);
        }
        // print menu again
        return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
      }));
    case CUSTOM_POST_ACTION.ADD_TAGS:
      return await askTags(state.tags, tgChat, tgChat.asyncCb(async (newTags: string[]) => {
        state.tags = newTags;
        // print menu again
        return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
      }));
    case CUSTOM_POST_ACTION.ADD_URL_BUTTON:
      return await askUrlButton(tgChat, tgChat.asyncCb(async (urlButton?: TgReplyBtnUrl) => {
        if (!urlButton) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedUrlButton);

          delete state.tgUrlBtn;

          return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
        }

        state.tgUrlBtn = urlButton;

        await tgChat.reply(
          tgChat.app.i18n.commonPhrases.addedUrlButton + '\n'
          + `${urlButton.text} - ${urlButton.url}`,
          undefined,
          true
        );

        // print menu again
        return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
      }));
    case CUSTOM_POST_ACTION.SET_AUTO_REMOVE:
      return await askTimePeriod(tgChat, tgChat.asyncCb(async (
        hoursPeriod?: number,
        certainIsoDateTime?: string
      ) => {
        if (!hoursPeriod && !certainIsoDateTime) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedDeleteTimer);

          delete state.autoDeleteTgIsoDateTime;

          return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
        }

        state.autoDeleteTgIsoDateTime = certainIsoDateTime
        state.autoDeletePeriodHours = hoursPeriod

        if (state.autoDeleteTgIsoDateTime) {
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.addedDeleteTimer
            + moment(state.autoDeleteTgIsoDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT)
          )
        }
        else if (state.autoDeletePeriodHours) {
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.addedDeleteTimerPeriod
            + state.autoDeletePeriodHours
          )
        }

        // print menu again
        return askCustomPostMenu(blogName, tgChat, state, validate, onDone);
      }));
    default:
      throw new Error(`Unknown action`);
  }
}


//state.autoDeleteTgIsoDateTime = makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset);

// function makeDateTimeMsg(tgChat: TgChat, state: CustomPostState): string {
//   const utcOffset = makeUtcOffsetStr(tgChat.app.appConfig.utcOffset);
//   const {selectedDate, selectedTime} = state;
//
//   if (selectedDate && selectedTime) {
//     return tgChat.app.i18n.commonPhrases.selectedDateAndTime
//       + `${selectedDate} ${selectedTime} ${utcOffset}`
//   }
//   else if (selectedDate && !selectedTime) {
//     return tgChat.app.i18n.commonPhrases.selectedOnlyDate
//       + `${selectedDate} ${utcOffset}`
//   }
//   else if (!selectedDate && selectedTime) {
//     return tgChat.app.i18n.commonPhrases.selectedOnlyTime
//       + `${selectedTime} ${utcOffset}`
//   }
//   else {
//     return 'None';
//   }
// }

// [
//   {
//     text: (state.pubDate)
//       ? tgChat.app.i18n.commonPhrases.pubDate
//         + moment(state.pubDate).format(PRINT_FULL_DATE_FORMAT)
//       : tgChat.app.i18n.commonPhrases.setPubDate,
//     callback_data: CUSTOM_POST_ACTION.DATE_SELECT,
//   },
//   {
//     text: (state.pubTime)
//       ? tgChat.app.i18n.commonPhrases.changedPubTime + state.pubTime
//       : tgChat.app.i18n.commonPhrases.setPubTime,
//     callback_data: CUSTOM_POST_ACTION.TIME_SELECT,
//   },
// ],

// case CUSTOM_POST_ACTION.DATE_SELECT:
//   return await askDate(tgChat, tgChat.asyncCb(async (newDate: string) => {
//     state.pubDate = newDate;
//     // print result
//     await tgChat.reply(makeDateTimeMsg(tgChat, state));
//     // print menu again
//     return askCustomPostMenu(blogName, tgChat, state, onDone);
//   }));
// case CUSTOM_POST_ACTION.TIME_SELECT:
//   return await askTime(tgChat, tgChat.asyncCb(async (newTime: string) => {
//     state.pubTime = newTime;
//     // print result
//     await tgChat.reply(makeDateTimeMsg(tgChat, state));
//     // print menu again
//     return askCustomPostMenu(blogName, tgChat, state, onDone);
//   }));

//(state.pubDate && state.pubTime) ? OK_BTN : undefined,