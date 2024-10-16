import TgChat from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/TgChat';
import {addSimpleStep} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/helpers';
import {TgReplyButton} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/TgReplyButton';
import {CANCEL_BTN_CALLBACK} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/buttons';


export type TelegraphMenu = 'TELEGRAPH_LIST';

export const TELEGRAPH_MENU: Record<TelegraphMenu, TelegraphMenu> = {
  TELEGRAPH_LIST: 'TELEGRAPH_LIST',
};


export async function askTelegraphMenu(tgChat: TgChat, onDone: (action: TelegraphMenu) => void) {
  const auth_url = (await tgChat.app.telegraPh.getAccount()).auth_url;

  await addSimpleStep(
    tgChat,
    (): [string, TgReplyButton[][]] => {
      return [
        tgChat.app.i18n.menu.telegraphMenu,
        [
          [
            {
              text: 'Log in to telegra.ph',
              url: auth_url
            } as any,
            {
              text: tgChat.app.i18n.menu.telegraphList,
              callback_data: TELEGRAPH_MENU.TELEGRAPH_LIST,
            },
          ],
          [
            {
              text: tgChat.app.i18n.buttons.toMainMenu,
              callback_data: CANCEL_BTN_CALLBACK,
            }
          ]
        ]
      ]
    },
    (queryData: string) => {
      switch (queryData) {
        case CANCEL_BTN_CALLBACK:
          return tgChat.steps.cancel();
        case TELEGRAPH_MENU.TELEGRAPH_LIST:
          return onDone(TELEGRAPH_MENU.TELEGRAPH_LIST);
        default:
          throw new Error(`Unknown action`);
      }
    }
  );
}
