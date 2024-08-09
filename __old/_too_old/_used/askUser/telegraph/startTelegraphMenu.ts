import TgChat from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/TgChat';
import {askTelegraphMenu, TELEGRAPH_MENU, TelegraphMenu} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/askUser/telegraph/askTelegraphMenu';
import {startTelegraphList} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/askUser/telegraph/startTelegraphList';


export async function startTelegraphMenu(tgChat: TgChat) {
  await askTelegraphMenu(tgChat, tgChat.asyncCb(async (action: TelegraphMenu) => {
    switch (action) {
      case TELEGRAPH_MENU.TELEGRAPH_LIST:
        return await startTelegraphList(tgChat)
      default:
        throw new Error(`Unknown action`)
    }
  }))
}
