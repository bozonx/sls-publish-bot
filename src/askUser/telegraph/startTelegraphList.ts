import {Page} from 'better-telegraph/src/types.js';
import TgChat from '../../apiTg/TgChat.js';
import {askTelegraphList} from './askTelegraphList.js';
import {askConfirm} from '../common/askConfirm.js';


export async function startTelegraphList(tgChat: TgChat) {
  await askTelegraphList(tgChat, tgChat.asyncCb(async (page: Page) => {

    await tgChat.reply(makePageDetails(page), undefined, false, true)

    await askConfirm(tgChat, () => {}, '🤔', true)
  }))
}


function makePageDetails(page: Page): string {
  const result : string[] = []

  result.push(`title<a href="${page.image_url}">:</a> <a href="${page.url}">${page.title}</a>`)
  result.push(`description: ${page.description}`)
  result.push(`views: ${page.views}`)

  return result.join('\n')
}
