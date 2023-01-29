// @ts-ignore
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import TgChat from '../apiTg/TgChat.js';


export async function requestPageProps(
  pageId: string,
  tgChat: TgChat
): Promise<PageObjectResponse['properties']> {
  const resultPage: PageObjectResponse = await tgChat.app.notion.api.pages.retrieve({
    page_id: pageId,
  }) as PageObjectResponse

  return resultPage.properties
}
