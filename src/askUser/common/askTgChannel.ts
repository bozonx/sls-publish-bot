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
import {askText} from './askText.js';


const ASK_TG_CHANNEL = {
  ANOTHER: 'ANOTHER',
}

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
      {
        text: tgChat.app.i18n.menu.anotherChannel,
        callback_data: ASK_TG_CHANNEL.ANOTHER,
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

          // TODO: сделать поиск

          // const url = _.trim(textMsg.text)
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
          else if (queryData === ASK_TG_CHANNEL.ANOTHER) {
            await askAnotherChannel(tgChat, (channelName: string, channelUrl?: string) => {
              onDone(channelName, channelUrl)
            })
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


async function askAnotherChannel(tgChat: TgChat, onDone: (channelName: string, channelUrl?: string) => void) {
  await askText(tgChat, tgChat.asyncCb(async (textHtml?: string, channelName?: string) => {
    await askText(tgChat, (textHtml?: string, channelUrl?: string) => {
      onDone(channelName!, channelUrl)
    }, tgChat.app.i18n.menu.anotherChannelUrl, true, tgChat.app.i18n.commonPhrases.skip)
  }), tgChat.app.i18n.menu.anotherChannelName, false)
}
