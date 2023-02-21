import {getFirstImageFromNotionBlocks} from '../publish/publishHelpers.js';
import {convertNotionToTgHtml} from '../helpers/convertNotionToTgHtml.js';
import {publishTgImage} from '../apiTg/publishTg.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NotionBlocks} from '../types/notion.js';
import TgChat from '../apiTg/TgChat.js';


export async function printCreative(tgChat: TgChat, item: PageObjectResponse, pageContent: NotionBlocks) {
  const image = getFirstImageFromNotionBlocks(pageContent)
  const btnText = (item.properties?.btnText as any).rich_text[0]?.plain_text
  const btnUrl = (item.properties?.btnUrl as any).url
  const usePreview = (item.properties?.usePreview as any).checkbox
  const creativeHtml = convertNotionToTgHtml(pageContent)
  const btnUrlResult = (btnText && btnUrl) ? {text: btnText, url: btnUrl} : undefined

  if (image) {
    // as image
    await publishTgImage(tgChat.app, tgChat.botChatId, image, creativeHtml, btnUrlResult)
  }
  else {
    // as just text
    await tgChat.reply(
      creativeHtml,
      btnUrlResult && [[btnUrlResult]],
      !usePreview,
      true
    )
  }
}
