import moment from 'moment';
import TgChat from '../apiTg/TgChat';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  FULL_DATE_FORMAT
} from '../types/constants';
import BaseState from '../types/BaseState';
import {TextMessageEvent} from '../types/MessageEvent';
import {makeUtcOffsetStr} from '../helpers/helpers';


const SELECT_PUB_DATE = {
  DATE_TODAY: 'DATE_TODAY',
  DATE_TOMORROW: 'DATE_TOMORROW',
  DATE_AFTER_TOMORROW: 'DATE_AFTER_TOMORROW',
}


export async function askPubDate(tgChat: TgChat, onDone: (selectedDateString: string) => void) {
  const msg = tgChat.app.i18n.menu.selectDate
    + `. ${makeUtcOffsetStr(tgChat.app.appConfig.utcOffset)}.`;
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
      BACK_BTN,
      CANCEL_BTN
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.TEXT,
        tgChat.asyncCb( (m) => incomeText(m, tgChat, onDone))
      ),
      AppEvents.TEXT
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
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
      AppEvents.CALLBACK_QUERY
    ]);
  });
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

  const selectedDateString = currentDate.format(FULL_DATE_FORMAT);

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
      // TODO: а если следующий год ???
      // TODO: а если другое число дней в месяце ???
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

  const selectedDateString = currentDate.format(FULL_DATE_FORMAT);

  onDone(selectedDateString);
}
