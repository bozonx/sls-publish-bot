import _ from 'lodash';
import TgChat from '../../apiTg/TgChat.js';
import {ChatEvents, WARN_SIGN} from '../../types/constants.js';
import BaseState from '../../types/BaseState.js';
import {PhotoMessageEvent, TextMessageEvent} from '../../types/MessageEvent.js';
import {
  BACK_BTN_CALLBACK,
  CANCEL_BTN_CALLBACK,
  makeBackBtn,
  makeCancelBtn,
  SKIP_BTN_CALLBACK
} from '../../helpers/buttons.js';
import {convertMdastToHtml} from '../../helpers/convertCommonMdToTgHtml.js';
import {convertTgInputToMdast} from '../../helpers/convertTgInputToMdast.js';


type ResultCallback = (textHtml?: string, cleanText?: string) => void


export async function askText(
  tgChat: TgChat,
  onDone: ResultCallback,
  msgReplace?: string,
  allowNoText = true,
  noTextLabel?: string,
  validate?: (textHtml?: string, cleanText?: string) => void
) {
  const msg = (msgReplace) ? msgReplace : tgChat.app.i18n.menu.askTypeText;
  const buttons = [
    (allowNoText) ? [
      {
        text: (noTextLabel) ? noTextLabel : tgChat.app.i18n.buttons.withoutText,
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
    state.messageIds.push(await tgChat.reply(msg, buttons));

    listenToText(tgChat, state, (textHtml?: string, cleanText?: string) => {
      if (validate) {
        try {
          validate(textHtml, cleanText);
        }
        catch (e) {
          tgChat.reply(WARN_SIGN + ' ' + e)
            .catch((e) => tgChat.log.error(e));

          return;
        }
      }

      onDone(textHtml, cleanText)
    })

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

function listenToText(tgChat: TgChat, state: BaseState, handleResult: ResultCallback) {
  // listen to text
  state.handlerIndexes.push([
    tgChat.events.addListener(
      ChatEvents.TEXT,
      tgChat.asyncCb(async (textMsg: TextMessageEvent) => {
        handleResult(
          _.trim(convertMdastToHtml(convertTgInputToMdast(
            textMsg.text,
            textMsg.entities
          ))),
          _.trim(textMsg.text)
        );
      })
    ),
    ChatEvents.TEXT
  ]);
  // listen to photo for caption
  state.handlerIndexes.push([
    tgChat.events.addListener(
      ChatEvents.PHOTO,
      tgChat.asyncCb(async (photoMsg: PhotoMessageEvent) => {
        if (photoMsg.caption) {
          handleResult(
            _.trim(convertMdastToHtml(convertTgInputToMdast(
              photoMsg.caption,
              photoMsg.entities
            ))),
            _.trim(photoMsg.caption)
          );
        }
        else {
          await tgChat.reply(tgChat.app.i18n.message.noMediaCaption)
        }
      })
    ),
    ChatEvents.PHOTO
  ]);
  // listen to video for caption
  state.handlerIndexes.push([
    tgChat.events.addListener(
      ChatEvents.VIDEO,
      tgChat.asyncCb(async (videoMsg: PhotoMessageEvent) => {
        if (videoMsg.caption) {
          handleResult(
            _.trim(convertMdastToHtml(convertTgInputToMdast(
              videoMsg.caption,
              videoMsg.entities
            ))),
            _.trim(videoMsg.caption)
          );
        }
        else {
          await tgChat.reply(tgChat.app.i18n.message.noMediaCaption)
        }
      })
    ),
    ChatEvents.VIDEO
  ]);
}
