import moment from 'moment';
import TgChat from '../apiTg/TgChat.js';
import {DB_DEFAULT_PAGE_SIZE} from '../apiNotion/constants.js';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {ISO_DATE_FORMAT} from '../types/constants.js';


/**
 * Load not published items from content plan
 */
export async function requestNotPublishedFromContentPlan(
  blogName: string,
  tgChat: TgChat,
  startCursor = 0
): Promise<PageObjectResponse[]> {
  const currentDate: string = moment()
    .utcOffset(tgChat.app.appConfig.utcOffset)
    .format(ISO_DATE_FORMAT)

  const response = await tgChat.app.notion.api.databases.query({
    database_id: tgChat.app.blogs[blogName].notion.contentPlanDbId,
    ...makeContentPlanQuery(currentDate, startCursor),
  })

  return (response as any).results
}

function makeContentPlanQuery(currentDate: string, startCursor: number): Record<string, any> {

  // TODO: фильтровать только поддерживаемые в данный момент
  // TODO: фильтровать поддерживаемые типы канала
  // TODO: .filter((item: any) => !item.archived) - не архивные

  return {
    start_cursor: startCursor,
    page_size: DB_DEFAULT_PAGE_SIZE,
    // filter: {
    //   and: [
    //     {
    //       property: 'date',
    //       date: {
    //         on_or_after: currentDate,
    //       },
    //     },
    //     {
    //       or: [
    //         {
    //           property: 'status',
    //           select: {
    //             equals: 'to_edit',
    //           },
    //         },
    //         {
    //           property: 'status',
    //           select: {
    //             equals: 'to_correct',
    //           },
    //         },
    //         {
    //           property: 'status',
    //           select: {
    //             equals: 'to_publish',
    //           },
    //         },
    //       ],
    //     }
    //   ],
    //
    // },
    sorts: [
      {
        property: 'date',
        direction: 'descending',
      },
    ],
  }
}
