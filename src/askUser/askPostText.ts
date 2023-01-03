import TgChat from '../apiTg/TgChat.js';
import {ChatEvents, BACK_BTN, CANCEL_BTN} from '../types/constants.js';
import BaseState from '../types/BaseState.js';
import {TextMessageEvent} from '../types/MessageEvent.js';


export async function askPostText(
  blogName: string,
  tgChat: TgChat,
  onDone: (text?: string) => void
) {
  const msg = tgChat.app.i18n.menu.askTypeText;
  const buttons = [
    [
      BACK_BTN,
      CANCEL_BTN,
    ]
  ];

  // TODO: validate text !!! количество символов
  // TODO: наверное экранировать лишние символы???
  // TODO: вырезать нечитаемые символы
  // TODO: см модуль sanitize text

  // TODO: проверить поддерживается ли форвард сообщений
  // TODO: если форвардится картинка то можно взять от туда caption

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          onDone((textMsg.text === '0') ? undefined : textMsg.text);
        })
      ),
      ChatEvents.TEXT
    ]);
  });
}
