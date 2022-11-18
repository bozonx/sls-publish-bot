import TgChat from '../apiTg/TgChat';
import {CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {addSimpleStep} from '../helpers/helpers';


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
