import TgChat from '../apiTg/TgChat.js';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants.js';
import {addSimpleStep} from '../helpers/helpers.js';


export async function askSiteMenu(tgChat: TgChat, onDone: () => void) {
  const msg = tgChat.app.i18n.menu.siteMenu;
  const buttons = [
    [
      CANCEL_BTN,
    ]
  ];

  await addSimpleStep(tgChat, msg, buttons,async (queryData: string) => {
    if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    // else do nothing
  });
}
