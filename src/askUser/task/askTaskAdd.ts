import TgChat from '../../apiTg/TgChat.js';
import {askDateTime} from '../common/askDateTime.js';
import {askSharePost} from '../common/askSharePost.js';
import {makeIsoDateTimeStr} from '../../helpers/helpers.js';


type OnDoneType = (messageIds: number[], chatId: number, startTime: string) => void


export async function askTaskAdd(msg: string, tgChat: TgChat, onDone: OnDoneType) {
  await askSharePost(msg, tgChat, tgChat.asyncCb(async(messageIds: number[], chatId: number) => {
    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      onDone(
        messageIds,
        chatId,
        makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
      )
    }), tgChat.app.i18n.message.maxTaskTime, undefined, true)
  }))
}

