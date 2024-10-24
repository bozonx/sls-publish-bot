import moment from 'moment';
import {compactUndefined} from 'squidlet-lib';
import TgChat from '../../apiTg/TgChat';
import {ChatEvents, ISO_DATE_FORMAT} from '../../types/constants';
import BaseState from '../../types/BaseState';
import {TextMessageEvent} from '../../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {makeUtcOffsetStr} from '../../helpers/helpers';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons';


const SELECT_PUB_DATE = {
  DATE_TODAY: 'DATE_TODAY',
  DATE_TOMORROW: 'DATE_TOMORROW',
  DATE_AFTER_TOMORROW: 'DATE_AFTER_TOMORROW',
}


export async function askDate(
  tgChat: TgChat,
  onDone: (selectedDateString: string) => void,
  additionalMsg?: string,
  stepName?: string
) {
  const msg = compactUndefined([
    additionalMsg,
    '',
    tgChat.app.i18n.menu.selectDate + `. ${makeUtcOffsetStr(tgChat.app.appConfig.utcOffset)}.`,
  ]).join('\n');
  const buttons = [
    [
      {
        text: tgChat.app.i18n.dates.today,
        callback_data: SELECT_PUB_DATE.DATE_TODAY,
      },
      {
        text: tgChat.app.i18n.dates.tomorrow,
        callback_data: SELECT_PUB_DATE.DATE_TOMORROW,
      },
      {
        text: tgChat.app.i18n.dates.afterTomorrow,
        callback_data: SELECT_PUB_DATE.DATE_AFTER_TOMORROW,
      },
    ],
    [
      makeBackBtn(tgChat.app.i18n),
      makeCancelBtn(tgChat.app.i18n)
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb( (m) => incomeText(m, tgChat, onDone))
      ),
      ChatEvents.TEXT
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          let addDays = -1;

          switch (queryData) {
            case BACK_BTN_CALLBACK:
              return tgChat.steps.back();
            case CANCEL_BTN_CALLBACK:
              return tgChat.steps.cancel();
            case SELECT_PUB_DATE.DATE_TODAY:
              addDays = 0;

              break;
            case SELECT_PUB_DATE.DATE_TOMORROW:
              addDays = 1;

              break;
            case SELECT_PUB_DATE.DATE_AFTER_TOMORROW:
              addDays = 2;

              break;
            default:
              throw new Error(`Unknown action`);
          }

          if (addDays !== -1) await pressedBtn(addDays, tgChat, onDone);
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  }, undefined, stepName);
}



async function pressedBtn(
  addDays: number,
  tgChat: TgChat,
  onDone: (selectedDateString: string) => void
) {
  const currentDate = moment().utcOffset(tgChat.app.appConfig.utcOffset);

  if (addDays > 0) {
    currentDate.add(addDays, 'days');
  }
  // else today

  const selectedDateString = currentDate.format(ISO_DATE_FORMAT);

  onDone(selectedDateString);
}

async function incomeText(
  incomeMsg: TextMessageEvent,
  tgChat: TgChat,
  onDone: (selectedDateString: string) => void
) {
  const currentDate = moment().utcOffset(tgChat.app.appConfig.utcOffset);
  const splat = incomeMsg.text.split('.');

  if (splat.length === 1) {
    // only date num. Without month
    const dateNum = Number(splat[0]);

    if (Number.isNaN(dateNum)) {
      await tgChat.reply(tgChat.app.i18n.errors.incorrectDate);

      return;
    }

    if (dateNum < currentDate.date()) {
      // if it is the past then increment month
      // if month is 13 then it will be the next year
      currentDate.month(currentDate.month() + 1);
    }
    // change date num of current date
    currentDate.date(dateNum);
  }
  else if (splat.length === 2) {
    // date and month
    const dateNum = Number(splat[0]);
    const monthNum = Number(splat[1]);

    if (Number.isNaN(dateNum)) {
      await tgChat.reply(tgChat.app.i18n.errors.incorrectDate);

      return;
    }
    else if (Number.isNaN(monthNum)) {
      await tgChat.reply(tgChat.app.i18n.errors.incorrectDate);

      return;
    }

    const cloneDate = currentDate.clone();

    currentDate.month(monthNum - 1);
    currentDate.date(dateNum);

    if (currentDate.unix() < cloneDate.unix()) {
      currentDate.year(currentDate.year() + 1);
    }
  }
  else {
    await tgChat.reply(tgChat.app.i18n.errors.incorrectDate);

    return;
  }

  const selectedDateString = currentDate.format(ISO_DATE_FORMAT);

  onDone(selectedDateString);
}
