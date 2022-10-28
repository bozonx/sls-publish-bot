import TgChat from '../tgApi/TgChat';
import {makeBaseState} from '../helpers/helpers';
import BaseState from '../types/BaseState';
import {AppEvents, BACK_BTN, CANCEL_BTN, MENU_MANAGE_SITE} from '../types/consts';
import moment from 'moment';


const DATE_TODAY = 'date_today';
const DATE_TOMORROW = 'date_tomorrow';
const DATE_AFTER_TOMORROW = 'date_after_tomorrow';


export async function askPubTime(tgChat: TgChat, onDone: (selectedDateString: string) => void) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);

    // TODO: надо удалить хэндлер
    const msgHandlerIndex = tgChat.events.addListener(AppEvents.MESSAGE, (msg: string) => {
      incomeMessage(msg, tgChat, onDone)
        .catch((e) => {throw e});
    });

    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      let addDays = -1;

      if (queryData === DATE_TODAY) {
        addDays = 0;
      }
      else if (queryData === DATE_TOMORROW) {
        addDays = 1;
      }
      else if (queryData === DATE_AFTER_TOMORROW) {
        addDays = 2;
      }

      if (addDays !== -1) {
        pressedBtn(addDays, tgChat, onDone)
          .catch((e) => {throw e});
      }
    });
  });
}


async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(
    tgChat.app.i18n.menu.selectDate
    + `Utc offset = ${tgChat.app.config.utcOffset}.`,
    [
      {
        text: tgChat.app.i18n.dates.today,
        callback_data: DATE_TODAY,
      },
      {
        text: tgChat.app.i18n.dates.tomorrow,
        callback_data: DATE_TOMORROW,
      },
      {
        text: tgChat.app.i18n.dates.afterTomorrow,
        callback_data: DATE_AFTER_TOMORROW,
      },
    ], [
      BACK_BTN,
      CANCEL_BTN,
    ]
  );
}

async function pressedBtn(
  addDays: number,
  tgChat: TgChat,
  onDone: (selectedDateString: string) => void
) {
  const currentDate = moment().utcOffset(tgChat.app.config.utcOffset);

  if (addDays > 0) {
    currentDate.add(addDays, 'days');
  }

  const selectedDateString = currentDate.format('DD.MM.YYYY')

  await tgChat.reply(tgChat.app.i18n.menu.selectedDate + selectedDateString);

  onDone(selectedDateString);
}

async function incomeMessage(
  msg: string,
  tgChat: TgChat,
  onDone: (selectedDateString: string) => void
) {
  const currentDate = moment().utcOffset(tgChat.app.config.utcOffset);
  const splat = msg.split('.');

  if (splat.length === 1) {
    const dateNum = Number(splat[0]);

    if (Number.isNaN(dateNum)) {
      throw new Error(`Incorrect date`);
    }

    if (dateNum <= currentDate.date()) {
      currentDate.month(currentDate.month() + 1);
    }

    currentDate.date(dateNum);
  }
  else if (splat.length === 2) {
    const dateNum = Number(splat[0]);
    const monthNum = Number(splat[1]);

    if (Number.isNaN(dateNum)) {
      throw new Error(`Incorrect date`);
    }
    else if (Number.isNaN(monthNum)) {
      throw new Error(`Incorrect date`);
    }

    const cloneDate = currentDate.clone();

    currentDate.month(monthNum - 1);
    currentDate.date(dateNum);

    if (currentDate.unix() < cloneDate.unix()) {
      currentDate.year(currentDate.year() + 1);
    }
  }
  else {
    throw new Error(`Incorrect date`);
  }

  const selectedDateString = currentDate.format('DD.MM.YYYY')

  await tgChat.reply(tgChat.app.i18n.menu.selectedDate + selectedDateString);

  onDone(selectedDateString);
}
