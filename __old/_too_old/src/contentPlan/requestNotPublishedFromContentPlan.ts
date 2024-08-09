import moment from 'moment';
import TgChat from '../apiTg/TgChat';
import {ISO_DATE_FORMAT, UTC_TIMEZONE_NUM} from '../types/constants';
import {NotionListItem} from '../types/notion';


/**
 * Load not published items from content plan
 */
export async function requestNotPublishedFromContentPlan(
  blogName: string,
  tgChat: TgChat,
  pageSize: number,
  startCursorUuid: string | null
): Promise<NotionListItem> {
  const currentDate: string = moment()
    // change local date and time to UTC time
    .utcOffset(UTC_TIMEZONE_NUM)
    .format(ISO_DATE_FORMAT)

  const response = await tgChat.app.notion.api.databases.query({
    database_id: tgChat.app.blogs[blogName].notion.contentPlanDbId,
    ...makeContentPlanQuery(currentDate, pageSize, startCursorUuid),
  })

  return {
    items: (response as any).results,
    nextCursor: response.next_cursor,
    hasMore: response.has_more,
  }
}

function makeContentPlanQuery(
  currentDate: string,
  pageSize: number,
  startCursorUuid: string | null
): Record<string, any> {
  return {
    start_cursor: startCursorUuid || undefined,
    page_size: pageSize,
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
