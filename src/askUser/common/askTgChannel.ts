import _ from 'lodash';
import TgChat from '../../apiTg/TgChat.js';
import {ChatEvents} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {TextMessageEvent} from '../../types/MessageEvent.js';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  SKIP_BTN_CALLBACK
} from '../../helpers/buttons.js';


type ResultCallback = (channelName?: string, channelUrl?: string) => void


export async function askTgChannel(
  tgChat: TgChat,
  onDone: ResultCallback,
  msgReplace?: string,
  allowNoText = true,
  skipLabel?: string,
) {
  const msg = (msgReplace) ? msgReplace : tgChat.app.i18n.menu.askTgChannel
  const buttons = [
    (allowNoText) ? [
      {
        text: (skipLabel) ? skipLabel : tgChat.app.i18n.commonPhrases.skip,
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
          const url = _.trim(textMsg.text)

          // TODO: распознать имя канала

          onDone(
            'no name',
            url
          );
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
