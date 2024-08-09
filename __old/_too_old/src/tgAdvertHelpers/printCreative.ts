import {getFirstImageFromNotionBlocks} from '../helpers/publishHelpers';
import {convertNotionToTgHtml} from '../helpers/convertNotionToTgHtml';
import {publishTgImage} from '../apiTg/publishTg';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NotionBlocks} from '../types/notion';
import TgChat from '../apiTg/TgChat';


const CREATIVE_PROPS = {
  btnText: 'btnText',
  btnUrl: 'btnUrl',
  usePreview: 'usePreview',
}


export async function printCreative(tgChat: TgChat, item: PageObjectResponse, pageContent: NotionBlocks) {
  const image = getFirstImageFromNotionBlocks(pageContent)
  const btnText = (item.properties?.[CREATIVE_PROPS.btnText] as any).rich_text[0]?.plain_text
  const btnUrl = (item.properties?.[CREATIVE_PROPS.btnUrl] as any).url
  const usePreview = (item.properties?.[CREATIVE_PROPS.usePreview] as any).checkbox
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
