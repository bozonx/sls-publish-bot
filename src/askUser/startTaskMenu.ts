import {askTasksListMenu} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import TgChat from '../apiTg/TgChat';


export async function startTaskMenu(tgChat: TgChat) {
  await askTasksListMenu(
    tgChat,
    (taskId: string) => askTaskMenu(taskId, tgChat, () => {
      tgChat.steps.cancel();
    })
  );
}
