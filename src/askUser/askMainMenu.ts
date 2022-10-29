import {makeBaseState} from '../helpers/helpers';
import BaseState from '../types/BaseState';
import {AppEvents, MENU_MANAGE_SITE} from '../types/consts';
import TgChat from '../tgApi/TgChat';


const CHANNEL_MARKER = 'channel:';


export async function askMainMenu(tgChat: TgChat, onDone: (channelId: number) => void) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
        if (queryData === MENU_MANAGE_SITE) {
          handleSiteSelected(tgChat, onDone)
            .catch((e) => {throw e})

          return;
        }
        else if (queryData.indexOf(CHANNEL_MARKER) === 0) {
          handleChannelSelected(queryData, tgChat, onDone)
            .catch((e) => {throw e})
        }
        // else do nothing
      }),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

async function handleChannelSelected(queryData: string, tgChat: TgChat, onDone: (channelId: number) => void) {
  const splat: string[] = queryData.split(':');
  const channelId: number = Number(splat[1]);
  // print result
  await tgChat.reply(
    tgChat.app.i18n.menu.selectedChannel
    + tgChat.app.config.channels[channelId].dispname
  );

  return onDone(channelId);
}

async function handleSiteSelected(tgChat: TgChat, onDone: (channelId: number) => void) {
  onDone(-1);
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectChannel, [[
    ...tgChat.app.config.channels.map((item, index: number): any => {
      return {
        text: item.dispname,
        callback_data: CHANNEL_MARKER + index,
      };
    }),
    {
      text: tgChat.app.i18n.menu.selectManageSite,
      callback_data: MENU_MANAGE_SITE,
    }
  ]]);
}
