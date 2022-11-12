import TgChat from '../apiTg/TgChat';
import {askPoll} from '../askUser/askPoll';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {PollMessageEvent} from '../types/MessageEvent';


export async function startPublishPollTg(blogName: string, tgChat: TgChat) {
  await askPoll(tgChat, tgChat.asyncCb(async (message: PollMessageEvent) => {

    console.log(111, message)

    await tgChat.app.tg.bot.telegram.copyMessage(
      tgChat.botChatId,
      tgChat.botChatId,
      message.messageId,
    );
    // TODO: напечатать опрос
    await askPostConfirm(blogName, tgChat, () => {
      // TODO: создание задачи и написать в лог канал
    });
  }));
}
