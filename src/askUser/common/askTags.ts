import _ from 'lodash';
import TgChat from '../../apiTg/TgChat.js';
import {
  ChatEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {TextMessageEvent} from '../../types/MessageEvent.js';
import {makeTagsString} from '../../lib/common.js';


export const CLEAR_CB = 'CLEAR_CB';


export async function askTags(prevTags: string[], tgChat: TgChat, onDone: (tags: string[]) => void) {
  const msg = tgChat.app.i18n.menu.selectTags;
  const buttons = [
    [
      {
        text: tgChat.app.i18n.buttons.clear,
        callback_data: CLEAR_CB,
      }
    ],
    [
      BACK_BTN,
      CANCEL_BTN
    ],
  ];

  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print previous tags
    if (prevTags.length) {
      state.messageIds.push(await tgChat.reply(tgChat.app.i18n.menu.prevTags));
      state.messageIds.push(await tgChat.reply(makeTagsString(prevTags)));
    }
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
          else if (queryData === CLEAR_CB) {
            await tgChat.reply(tgChat.app.i18n.commonPhrases.clearedTags);

            return onDone([]);
          }
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.TEXT,
        tgChat.asyncCb(async (message: TextMessageEvent) => {
          const trimmed = _.trim(message.text);
          const tagsArr = trimmed.split(' ')
            .map((el) => _.trimStart(_.trim(el), '#'));
          const uniqTags = _.uniq(tagsArr)
          // print result
          await tgChat.reply(
            _.template(tgChat.app.i18n.commonPhrases.selectedTags)({
              COUNT: uniqTags.length
            })
            + makeTagsString(uniqTags)
          );
          onDone(uniqTags);
        })
      ),
      ChatEvents.TEXT
    ]);
  });

}
