import {getFirstImageFromNotionBlocks} from '../src/publish/publishHelpers.js';
import {convertNotionToTgHtml} from '../src/helpers/convertNotionToTgHtml.js';
import {publishTgImage} from '../src/apiTg/publishTg.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NotionBlocks} from '../src/types/notion.js';
import TgChat from '../src/apiTg/TgChat.js';


export async function printCreative(tgChat: TgChat, item: PageObjectResponse, pageContent: NotionBlocks) {
  const image = getFirstImageFromNotionBlocks(pageContent)
  const btnText = (item.properties?.btn_text as any).rich_text[0]?.plain_text
  const btnUrl = (item.properties?.btn_url as any).url
  const usePreview = (item.properties?.preview as any).checkbox
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
