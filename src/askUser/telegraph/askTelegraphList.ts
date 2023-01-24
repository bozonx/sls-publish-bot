import TgChat from '../../apiTg/TgChat.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';
import {TgReplyButton} from '../../types/TgReplyButton.js';


// export type TelegraphListMenu = 'TELEGRAPH_LIST';
//
// export const TELEGRAPH_MENU: Record<TelegraphMenu, TelegraphMenu> = {
//   TELEGRAPH_LIST: 'TELEGRAPH_LIST',
// };
//action: TelegraphMenu

export async function askTelegraphList(tgChat: TgChat, onDone: () => void) {
  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      const pages = await tgChat.app.telegraPh.getPages(4, 0)

      console.log(111, pages)

      return [
        tgChat.app.i18n.menu.telegraphMenu,
        [
          [

            // {
            //   text: 'Log in to telegra.ph',
            //   url: auth_url
            // } as any,
            // {
            //   text: tgChat.app.i18n.menu.telegraphList,
            //   callback_data: TELEGRAPH_MENU.TELEGRAPH_LIST,
            // },
          ],
          [
            CANCEL_BTN,
            BACK_BTN,
          ]
        ],
      ]
    },
    (queryData: string) => {
      switch (queryData) {
        case CANCEL_BTN_CALLBACK:
          return tgChat.steps.cancel();
        case BACK_BTN_CALLBACK:
          return tgChat.steps.cancel();
        // case TELEGRAPH_MENU.TELEGRAPH_LIST:
        //   return onDone(TELEGRAPH_MENU.TELEGRAPH_LIST);
        default:
          throw new Error(`Unknown action`);
      }
    }
  );
}
