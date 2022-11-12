import TgChat from '../apiTg/TgChat';
import {askPoll} from '../askUser/askPoll';


export async function startPublishPollTg(blogName: string, tgChat: TgChat) {
  await askPoll(tgChat, () => {
    // TODO: напечатать опрос
    // TODO: подтверждение
    // TODO: создание задачи и написать в лог канал
  });
}
