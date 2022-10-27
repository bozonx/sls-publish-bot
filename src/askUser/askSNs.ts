import TgChat from '../tgApi/TgChat';
import BaseState from '../types/BaseState';
import {BACK_BTN, CANCEL_BTN, CREATE_PREFIX, PUBLICATION_TYPES, SN_TYPES} from '../types/consts';


interface AskSnsState extends BaseState {
  channelId: number;
}


export async function askSNs(channelId: number, tgChat: TgChat, onDone: (channelId: number) => void) {
  const state: AskSnsState = {
    channelId,
    messageId: -1,
    handlerIndex: -1,
  };

  await tgChat.addOrdinaryStep(state, async () => {
    state.messageId = await printAskMessage(state.channelId, tgChat);
  });
}

async function printAskMessage(channelId: number, tgChat: TgChat): Promise<number> {
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
    ]
  );
}
