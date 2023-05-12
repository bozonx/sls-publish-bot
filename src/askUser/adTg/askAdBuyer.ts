import _ from 'lodash';
import TgChat from '../../apiTg/TgChat.js';
import {ChatEvents} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {TextMessageEvent} from '../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  SKIP_BTN_CALLBACK
} from '../../helpers/buttons.js';
import {convertTgInputToHtml} from '../../helpers/convertTgInputToHtml.js';


type ResultCallback = (buyerHtml?: string) => void


export async function askAdBuyer(
  tgChat: TgChat,
  onDone: ResultCallback,
  msgReplace?: string,
  allowSkip = true,
) {
  const msg = (msgReplace) ? msgReplace : tgChat.app.i18n.menu.askAdBuyer
  const buttons = [
    (allowSkip) ? [
      {
        text: tgChat.app.i18n.commonPhrases.skip,
        callback_data: SKIP_BTN_CALLBACK,
      },
    ] : [],
    [
      makeBackBtn(tgChat.app.i18n),
      makeCancelBtn(tgChat.app.i18n),
    ]
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons))

    // listen to text
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
          onDone(_.trim(convertTgInputToHtml(
            textMsg.text,
            textMsg.entities
          )))
        })
      ),
      ChatEvents.TEXT
    ])
    // listen to buttons
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back()
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel()
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
