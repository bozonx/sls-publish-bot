// @ts-ignore
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import NotionApi from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiNotion/NotionApi';


export async function requestPageProps(
  pageId: string,
  notionApi: NotionApi
): Promise<PageObjectResponse['properties']> {
  const resultPage: PageObjectResponse = await notionApi.api.pages.retrieve({
    page_id: pageId,
  }) as PageObjectResponse

  return resultPage.properties
}
