import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';


export type TelegraphMenu = 'LOGIN' | 'LIST';

export const TELEGRAPH_MENU: Record<TelegraphMenu, TelegraphMenu> = {
  LOGIN: 'LOGIN',
  LIST: 'LIST',
};


export async function askTelegraphMenu(tgChat: TgChat, onDone: (action: TelegraphMenu) => void) {
  const msg = tgChat.app.i18n.menu.telegraphMenu;
  const buttons = [
    [
      {
        text: 'Log in to telegra.ph',
        //callback_data: TELEGRAPH_MENU.LOGIN,
        url: 'https://telegra.ph/auth/'
        //  + tgChat.app.config.telegraPhToken
      } as any,
      {
        text: tgChat.app.i18n.menu.telegraphList,
        callback_data: TELEGRAPH_MENU.LIST,
      },
    ],
    [
      CANCEL_BTN,
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,(queryData: string) => {
    switch (queryData) {
      case CANCEL_BTN_CALLBACK:
        return tgChat.steps.cancel();
      case TELEGRAPH_MENU.LOGIN:
        return onDone(TELEGRAPH_MENU.LOGIN);
      case TELEGRAPH_MENU.LIST:
        return onDone(TELEGRAPH_MENU.LIST);
      default:
        throw new Error(`Unknown action`);
    }
  });
}
