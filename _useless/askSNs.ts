import TgChat from '../src/tgApi/TgChat';
import BaseState from '../src/types/BaseState';
import {
  AppEvents,
  BACK_BTN, BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  CREATE_PREFIX,
  SN_TYPES
} from '../src/types/consts';
import {PublicationTypes} from '../src/types/types';
import {OK_BTN} from '../src/types/consts';
import {OK_BTN_CALLBACK} from '../src/types/consts';


interface AskSnsState extends BaseState {
  channelId: number;
  pubType: PublicationTypes;
  sns: string[];
}


export async function askSNs(
  channelId: number,
  pubType: PublicationTypes,
  tgChat: TgChat,
  onDone: (sns: string[]) => void
) {
  const state: AskSnsState = {
    channelId,
    pubType,
    sns: Object.keys(tgChat.app.config.channels[channelId].sn),
    messageId: -1,
    handlerIndex: -1,
  };

  // skit if only one sn
  if (state.sns.length === 1) {
    await finish(state, tgChat, onDone);

    return;
  }
  else if (state.sns.length < 1) {
    // TODO: написать юзеру и сделать cancel
    throw new Error(`No one sn`);
  }

  await addStep(state, tgChat, onDone);
}

async function addStep(state: AskSnsState, tgChat: TgChat, onDone: (sns: string[]) => void) {
  await tgChat.addOrdinaryStep(state, async () => {
    // print ask type message
    state.messageId = await printAskMessage(state, tgChat);
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
        finish(state, tgChat, onDone)
          .catch((e) => {throw e});

        return;
      }
      else if (![
        CREATE_PREFIX + SN_TYPES.telegram,
        CREATE_PREFIX + SN_TYPES.instagram,
        CREATE_PREFIX + SN_TYPES.zen,
      ].includes(queryData)) {
        return;
      }

      handleSnRemoved(queryData, state, tgChat, onDone);
    });
  });
}

async function printAskMessage(state: AskSnsState, tgChat: TgChat): Promise<number> {
  return tgChat.reply(
    tgChat.app.i18n.menu.whichSns + '\n'
    + tgChat.app.i18n.menu.selectedSnsPre + state.sns.join(', ')  + '\n'
    + tgChat.app.i18n.menu.snsToDo,
    [
      ...state.sns.map((item) => {
        switch (item) {
          case SN_TYPES.telegram:
            return {
              text: tgChat.app.i18n.menu.removeSn + 'Tg',
              callback_data: CREATE_PREFIX + SN_TYPES.telegram,
            }
          case SN_TYPES.instagram:
            return {
              text: tgChat.app.i18n.menu.removeSn + 'Insta',
              callback_data: CREATE_PREFIX + SN_TYPES.instagram,
            }
          case SN_TYPES.zen:
            return {
              text: tgChat.app.i18n.menu.removeSn + 'Zen',
              callback_data: CREATE_PREFIX + SN_TYPES.zen,
            }
          default:
            throw new Error(`Unsupported social media type`)
        }
      }),
    ],
    [
      BACK_BTN,
      CANCEL_BTN,
      OK_BTN,
    ]
  );
}

async function handleSnRemoved(
  queryData: string,
  state: AskSnsState,
  tgChat: TgChat,
  onDone: (sns: string[]) => void
) {
  const snType = queryData.slice(CREATE_PREFIX.length);
  const index = state.sns.indexOf(snType);

  if (index < 0) throw new Error(`Can't find selected sn`);

  state.sns.splice(index, 1);

  if (state.sns.length > 1) {
    await addStep(state, tgChat, onDone);
  }
  else if (state.sns.length == 1) {
    await finish(state, tgChat, onDone);
  }
  if (state.sns.length < 1) {
    throw new Error(`Invalid count of sns`)
  }
}

async function finish(
  state: AskSnsState,
  tgChat: TgChat,
  onDone: (sns: string[]) => void
) {
  await tgChat.reply(tgChat.app.i18n.menu.selectedSns + state.sns.join(', '));

  onDone(state.sns);
}
