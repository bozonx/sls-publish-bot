import BaseState from '../types/BaseState';
import {AppEvents, MENU_MANAGE_SITE} from '../types/constants';
import TgChat from '../apiTg/TgChat';


export const SITE_SELECTED_RESULT = -1;
const CHANNEL_MARKER = 'channel:';


export async function askMainMenu(tgChat: TgChat, onDone: (channelId: number) => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === MENU_MANAGE_SITE) {
            onDone(SITE_SELECTED_RESULT);
          }
          else if (queryData.indexOf(CHANNEL_MARKER) === 0) {
            await handleChannelSelected(queryData, tgChat, onDone);
          }
          // else do nothing
        }
      )),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

async function handleChannelSelected(
  queryData: string,
  tgChat: TgChat,
  onDone: (channelId: number) => void
) {
  const splat: string[] = queryData.split(':');
  const channelId: number = Number(splat[1]);
  // print result
  await tgChat.reply(
    tgChat.app.i18n.menu.selectedChannel
    + tgChat.app.config.channels[channelId].dispname
  );

  onDone(channelId);
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectChannel, [
    tgChat.app.config.channels.map((item, index: number): any => {
      return {
        text: item.dispname,
        callback_data: CHANNEL_MARKER + index,
      };
    }),
    [
      {
        text: tgChat.app.i18n.menu.selectManageSite,
        callback_data: MENU_MANAGE_SITE,
      }
    ]
  ]);
}
