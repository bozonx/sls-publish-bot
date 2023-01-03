import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {DB_DEFAULT_PAGE_SIZE} from '../apiNotion/constants.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';


/**
 * Load not published items from content plan
 */
export async function loadNotPublished(blogName: string, tgChat: TgChat): Promise<PageObjectResponse[]> {
  const currentDate: string = moment()
    .utcOffset(tgChat.app.appConfig.utcOffset)
    .format('YYYY-MM-DD');

  const response = await tgChat.app.notion.api.databases.query({
    database_id: tgChat.app.blogs[blogName].notion.contentPlanDbId,
    ...makeContentPlanQuery(currentDate),
  });

  return (response as any).results.filter((item: any) => !item.archived);
}

function makeContentPlanQuery(currentDate: string): Record<string, any> {

  // TODO: фильтровать только поддерживаемые в данный момент
  // TODO: фильтровать поддерживаемые типы канала

  return {
    // TODO: надо выгребать вообще всё
    page_size: DB_DEFAULT_PAGE_SIZE,
    filter: {
      and: [
        {
          property: 'date',
          date: {
            on_or_after: currentDate,
          },
        },
        {
          or: [
            {
              property: 'status',
              select: {
                equals: 'to_edit',
              },
            },
            {
              property: 'status',
              select: {
                equals: 'to_correct',
              },
            },
            {
              property: 'status',
              select: {
                equals: 'to_publish',
              },
            },
          ],
        }
      ],

    },
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  }
}