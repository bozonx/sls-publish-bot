import TgChat from '../apiTg/TgChat.js';
import {askSiteMenu} from './askSiteMenu.js';


export async function startSiteMenu(tgChat: TgChat) {
  // site selected
  await askSiteMenu(tgChat, tgChat.asyncCb(async  () => {
    await tgChat.reply('Under construction');
    await tgChat.steps.cancel();
  }));
}