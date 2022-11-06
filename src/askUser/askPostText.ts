import TgChat from '../apiTg/TgChat';
import {AppEvents, BACK_BTN, CANCEL_BTN} from '../types/constants';
import BaseState from '../types/BaseState';
import {TextMessageEvent} from '../types/MessageEvent';


export async function askPostText(
  blogName: string,
  tgChat: TgChat,
  onDone: (text: string) => void
) {
  const msg = tgChat.app.i18n.menu.askTypeText;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          onDone(textMsg.text);
        })
      ),
      AppEvents.TEXT
    ]);
  });
}