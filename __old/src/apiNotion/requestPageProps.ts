// @ts-ignore
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import NotionApi from './NotionApi';


export async function requestPageProps(
  pageId: string,
  notionApi: NotionApi
): Promise<PageObjectResponse['properties']> {
  const resultPage: PageObjectResponse = await notionApi.api.pages.retrieve({
    page_id: pageId,
  }) as PageObjectResponse

  return resultPage.properties
}
