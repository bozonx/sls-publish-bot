import TgChat from '../apiTg/TgChat';
import {addSimpleStep} from '../helpers/helpers';


export type TelegraphMenu = 'LOGIN' | 'LIST';

export const TELEGRAPH_MENU: Record<TelegraphMenu, TelegraphMenu> = {
  LOGIN: 'LOGIN',
  LIST: 'LIST',
};


export async function askTelegraphMenu(tgChat: TgChat, onDone: (blogNameOrAction: string) => void) {
  const msg = tgChat.app.i18n.menu.telegraphMenu;
  const buttons = [
    [
      {
        text: 'Log in to telegra.ph',
        callback_data: TELEGRAPH_MENU.LOGIN,
      },
      {
        text: tgChat.app.i18n.menu.telegraphList,
        callback_data: TELEGRAPH_MENU.LIST,
      },
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,(queryData: string) => {

  });
}
