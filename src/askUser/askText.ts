import TgChat from '../apiTg/TgChat';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../types/constants';
import BaseState from '../types/BaseState';
import _ from 'lodash';
import {TextMessageEvent} from '../types/MessageEvent';


const SKIP_ACTION = 'SKIP_ACTION';


export async function askText(
  msg: string,
  allowSkip: boolean = true,
  tgChat: TgChat,
  onDone: (text: string) => void
) {
  const buttons = [
    [
      {
        text: tgChat.app.i18n.commonPhrases.skip,
        callback_data: SKIP_ACTION,
      }
    ],
    [
      BACK_BTN,
      CANCEL_BTN
    ],
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons));
    // listen to result
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
          else if (queryData === SKIP_ACTION) {
            onDone('');
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (message: TextMessageEvent) => {
          onDone(_.trim(message.text));
        })
      ),
      ChatEvents.TEXT
    ]);
  });

}
