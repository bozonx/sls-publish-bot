import TgChat from '../../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  CANCEL_BTN,
  SKIP_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK, SKIP_BTN_CALLBACK
} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {TextMessageEvent} from '../../types/MessageEvent.js';
import {tgInputToMd} from '../../helpers/tgInputToMd.js';

/*
  text: 'norm bold italic underiline strikethrough monospace spoiler  https://google.com url',
  entities: [
    { offset: 5, length: 4, type: 'bold' },
    { offset: 10, length: 6, type: 'italic' },
    { offset: 17, length: 10, type: 'underline' },
    { offset: 28, length: 13, type: 'strikethrough' },
    { offset: 42, length: 9, type: 'code' },
    { offset: 52, length: 7, type: 'spoiler' },
    { offset: 61, length: 18, type: 'url' },
    {
      offset: 80,
      length: 3,
      type: 'text_link',
      url: 'https://google.com/'
    }

 */


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
      SKIP_BTN,
    ]
  ];

  // TODO: если форвардится картинка то можно взять от туда caption

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to photo
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {

          // TODO: validate text !!! количество символов

          const text = tgInputToMd(textMsg.text, textMsg.entities)

          onDone(text);
        })
      ),
      ChatEvents.TEXT
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          else if (queryData === SKIP_BTN_CALLBACK) {
            onDone()
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}
