import TgChat from '../src/tgApi/TgChat';
import {makeBaseState} from '../../src/helpers/helpers';
import BaseState from '../../src/types/BaseState';
import {AppEvents} from '../src/types/consts';


export async function askPubTime(tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat);
    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {

    });
  });
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectChannel, [
    // ...tgChat.app.config.channels.map((item, index: number): any => {
    //   return {
    //     text: item.dispname,
    //     callback_data: CHANNEL_MARKER + index,
    //   };
    // }),
  ]);
}