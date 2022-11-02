import TgChat from '../apiTg/TgChat';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';


export async function loadPageProps(
  pageId: string,
  tgChat: TgChat
): Promise<PageObjectResponse['properties']> {
  const resultPage: PageObjectResponse = await tgChat.app.notion.api.pages.retrieve({
    page_id: pageId,
  }) as PageObjectResponse;

  return resultPage.properties;
}
