import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {DB_DEFAULT_PAGE_SIZE} from '../apiNotion/constants.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {ISO_DATE_FORMAT, UTC_TIMEZONE_NUM} from '../types/constants.js';


/**
 * Load not published items from content plan
 */
export async function requestNotPublishedFromContentPlan(
  blogName: string,
  tgChat: TgChat,
  startCursorUuid?: string
): Promise<PageObjectResponse[]> {
  const currentDate: string = moment()
    // change local date and time to UTC time
    .utcOffset(UTC_TIMEZONE_NUM)
    .format(ISO_DATE_FORMAT)

  const response = await tgChat.app.notion.api.databases.query({
    database_id: tgChat.app.blogs[blogName].notion.contentPlanDbId,
    ...makeContentPlanQuery(currentDate, startCursorUuid),
  })

  return (response as any).results
}

function makeContentPlanQuery(currentDate: string, startCursorUuid?: string): Record<string, any> {
  return {
    start_cursor: startCursorUuid,
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
