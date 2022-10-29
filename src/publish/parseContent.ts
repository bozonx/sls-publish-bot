import ContentItem from '../types/ContentItem';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {CONTENT_PROPS} from '../types/consts';


export function parseContentItem(item: PageObjectResponse): ContentItem {
  return {
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    gist: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.plain_text || '',
    pageLink: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.href || '',
    note: (item.properties[CONTENT_PROPS.note] as any)?.title[0]?.plain_text || '',
    status: (item.properties[CONTENT_PROPS.status] as any)?.select.name || '',
    onlySn: (item.properties[CONTENT_PROPS.onlySn] as any)?.multi_select
      .map((el: any) => el.name) || [],
    type: (item.properties[CONTENT_PROPS.type] as any)?.select.name || '',
  }
}
