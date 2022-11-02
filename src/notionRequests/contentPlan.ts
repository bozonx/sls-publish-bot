import moment from 'moment/moment';
import TgChat from '../apiTg/TgChat';
import {DB_DEFAULT_PAGE_SIZE} from '../apiNotion/constants';
import {PageObjectResponse, RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints';


export interface ContentPlanButtonItem {
  // title for menu
  title: string;
  // item as is
  item: PageObjectResponse;
}


/**
 * Load not published items from content plan
 */
export async function loadNotPublished(blogName: string, tgChat: TgChat): Promise<ContentPlanButtonItem[]> {
  const currentDate: string = moment()
    .utcOffset(tgChat.app.appConfig.utcOffset)
    .format('YYYY-MM-DD');

  try {
    const response = await tgChat.app.notion.api.databases.query({
      database_id: tgChat.app.config.blogs[blogName].notionContentPlanDbId,
      ...makeContentPlanQuery(currentDate),
    });

    return prepareItems((response as any).results);
  }
  catch (e) {
    tgChat.log.error(`Can't load content plan data: ${e}`);

    // TODO: what to do in error case ????
    // TODO: нужно ли ждать отправки лога ????

    throw e;
  }
}


function prepareItems(results: PageObjectResponse[]): ContentPlanButtonItem[] {
  return results
    .filter((item) => !item.archived)
    .map((item): ContentPlanButtonItem => {
      const dateProp = item.properties['date'];
      const dateText: string = (dateProp as any).date.start;
      const shortDateText: string = moment(dateText).format('DD.MM');
      const gistProp = item.properties['gist/link'];
      const gistRichText: RichTextItemResponse = (gistProp as any).rich_text[0];

      return {
        title: `${shortDateText} ${gistRichText.plain_text}`,
        item,
      }
    });
}

function makeContentPlanQuery(currentDate: string): Record<string, any> {

  // TODO: фильтровать только поддерживаемые в данный момент
  // TODO: фильтровать поддерживаемые типы канала

  return {
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