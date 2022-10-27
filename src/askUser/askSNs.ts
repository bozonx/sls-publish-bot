import TgChat from '../tgApi/TgChat';
import BaseState from '../types/BaseState';
import {
  AppEvents,
  BACK_BTN, BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  CREATE_PREFIX,
  SN_TYPES
} from '../types/consts';
import {PublicationTypes} from '../types/types';
import {OK_BTN} from '../types/consts';
import {OK_BTN_CALLBACK} from '../types/consts';


interface AskSnsState extends BaseState {
  channelId: number;
}


export async function askSNs(
  channelId: number,
  pubType: PublicationTypes,
  tgChat: TgChat, onDone: () => void
) {
  const state: AskSnsState = {
    channelId,
    messageId: -1,
    handlerIndex: -1,
  };

  await tgChat.addOrdinaryStep(state, async () => {
    // print ask type message
    state.messageId = await printAskMessage(state.channelId, tgChat);
    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back()
          .catch((e) => {throw e});
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel()
          .catch((e) => {throw e});
      }
      else if (queryData === OK_BTN_CALLBACK) {
        // TODO: what to do????

        return;
        // return tgChat.steps.cancel()
        //   .catch((e) => {throw e});
      }
      // else if (![
      //   CREATE_PREFIX + SN_TYPES.telegram,
      //   CREATE_PREFIX + SN_TYPES.instagram,
      //   CREATE_PREFIX + SN_TYPES.zen,
      // ].includes(queryData)) {
      //   return;
      // }

      // finish(queryData, tgChat, onDone)
      //   .catch((e) => {throw e});
    });
  });
}

async function printAskMessage(channelId: number, tgChat: TgChat): Promise<number> {
  // TODO: делаем так:
  //       * сначала пишем список всех соц сетей
  //       * выводим кнопки - убрать тг, инс или дзен.и ОК
  //       * если посли убирания осталась одна соц сеть то завершаем
  //       * если осталось больше то опять спрашиваем
  //       * либо нажал ок

  return tgChat.reply(
    tgChat.app.i18n.menu.whichSns,
    [
      ...Object.keys(tgChat.app.config.channels[channelId].sn).map((item) => {
        switch (item) {
          case SN_TYPES.telegram:
            return {
              text: 'Telegram',
              callback_data: CREATE_PREFIX + SN_TYPES.telegram,
            }
          case SN_TYPES.instagram:
            return {
              text: 'Instagram',
              callback_data: CREATE_PREFIX + SN_TYPES.instagram,
            }
          case SN_TYPES.zen:
            return {
              text: 'Zen',
              callback_data: CREATE_PREFIX + SN_TYPES.zen,
            }
          default:
            throw new Error(`Unsupported social media type`)
        }
      }),
      BACK_BTN,
      CANCEL_BTN,
      OK_BTN,
    ]
  );
}

async function finish(
  queryData: string,
  tgChat: TgChat,
  onDone: () => void
) {
  // const pubType = queryData.slice(CREATE_PREFIX.length) as PublicationTypes;
  //
  // await tgChat.reply(
  //   tgChat.app.i18n.menu.selectedType
  //   + tgChat.app.i18n.publicationType[pubType]
  // );

  onDone();
}