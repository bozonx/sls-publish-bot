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

    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      let addDays = 0;

      if (queryData === DATE_TODAY) {
        addDays = 1;
      }
      else if (queryData === DATE_TOMORROW) {
        addDays = 2;
      }
      else if (queryData === DATE_AFTER_TOMORROW) {
        addDays = 3;
      }

      if (addDays) {
        finish(addDays, state, tgChat, onDone);
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

async function finish(
  addDays: number,
  state: BaseState,
  tgChat: TgChat,
  onDone: (selectedDateString: string) => void
) {
  const currentDate = moment().utcOffset(tgChat.app.config.utcOffset);

  if (addDays) {
    currentDate.add(addDays, 'days');
  }

  const selectedDateString = currentDate.format('DD.MM.YYYY')

  await tgChat.reply(tgChat.app.i18n.menu.selectedDate + selectedDateString);

  onDone(selectedDateString);
}
