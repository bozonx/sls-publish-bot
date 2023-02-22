import {fromHtml} from 'hast-util-from-html';
import {Element, Text} from 'hast'
import TgChat from '../apiTg/TgChat.js';
import {isValidUrl} from '../lib/common.js';
import {toHtml} from 'hast-util-to-html';


export async function makePost2000Text(
  tgChat: TgChat,
  rawTextHtml: string,
  imgUrl?: string
): Promise<string> {
  // if no image then return just text
  if (!imgUrl) return rawTextHtml
  // if there is an image then put it to text
  // make image from file id if need
  const resolvedImgUrl = (isValidUrl(imgUrl))
    ? imgUrl
    : (await tgChat.app.tg.bot.telegram.getFileLink(imgUrl)).href
  // save image to telegraph
  let imgTelegraphUrl

  try {
    imgTelegraphUrl = await tgChat.app.telegraPh.uploadImage(resolvedImgUrl)
  }
  catch (e) {
    throw new Error(tgChat.app.i18n.errors.errorUploadingImageTelegraph)
  }
  // put image to the text as hidden url
  return putLinkToSpace(rawTextHtml, imgTelegraphUrl)
}


function putLinkToSpace(rawTextHtml: string, url: string): string {
  const tree = fromHtml(rawTextHtml, {fragment: true})

  const wasChanged = recursiveCheckTree(tree.children as Element[], url)

  if (wasChanged === true) {
    return toHtml(tree)
  }

  return `<a href="${url}"> </a>` + rawTextHtml
}

function recursiveCheckTree(items: (Element | Text)[], url: string): boolean | 'break' {
  for (const index in items) {
    const item = items[index]
    // stop search if there is a link
    if (item.type === 'element' && item.tagName === 'a') return 'break'
    else if (item.type === 'text') {
      const spaceIndex = item.value.indexOf(' ')
      // skip it doesn't have any space
      if (spaceIndex === -1) continue

      const firstPart = item.value.slice(0, spaceIndex)
      const lastPart = item.value.slice(spaceIndex + 1)

      const linkEl: Element = {
        type: 'element',
        tagName: 'a',
        properties: {
          href: url,
        },
        children: [
          {
            type: 'text',
            value: ' ',
          }
        ]
      }

      // put text and link
      item.value = firstPart
      items.splice(Number(index) + 1, 0, linkEl)
      items.splice(Number(index) + 2, 0, {type: 'text', value: lastPart})

      return true
    }

    if ((item as Element).children) {
      const result = recursiveCheckTree((item as Element).children as (Element | Text)[], url)

      if (result !== false) return result
    }

  }

  return false
}


//console.log(111, putLinkToSpace('<p>some text <a>aa</a></p>', 'https://ya.ru'))
//console.log(111, putLinkToSpace('<p><b>some </b>text <a>aa</a></p>', 'https://ya.ru'))
//console.log(111, putLinkToSpace('<p><b>some</b><a>aa</a> </p>', 'https://ya.ru'))
