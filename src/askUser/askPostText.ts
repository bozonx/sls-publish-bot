import TgChat from '../apiTg/TgChat';
import {ChatEvents, BACK_BTN, CANCEL_BTN} from '../types/constants';
import BaseState from '../types/BaseState';
import {TextMessageEvent} from '../types/MessageEvent';


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
