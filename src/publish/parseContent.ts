import moment from 'moment';
// @ts-ignore
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import ContentItem, {
  CONTENT_PROPS,
  CONTENT_STATUS,
} from '../types/ContentItem.js';
import ru from '../I18n/ru.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';


export function parseContentItem(item: PageObjectResponse): ContentItem {
  const pubType: PublicationType = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';

  return {
    // date in iso format
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    nameGist: (item.properties[CONTENT_PROPS.nameGist] as any)?.title?.[0]?.plain_text || '',
    note: (item.properties[CONTENT_PROPS.note] as any)?.rich_text?.[0]?.plain_text || '',
    status: (item.properties[CONTENT_PROPS.status] as any)?.select.name || '',
    onlySn: (item.properties[CONTENT_PROPS.onlySn] as any)?.multi_select
      .map((el: any) => el.name) || [],
    type: pubType,
    tgTags: (item.properties[CONTENT_PROPS.tgTags] as any)?.multi_select
      .map((el: any) => el.name) || [],
    instaTags: (item.properties[CONTENT_PROPS.instaTags] as any)?.multi_select
  }
}

export function validateContentItem(item: ContentItem) {
  if (!item.date) throw new Error(`No date`)
  else if (!item.time) throw new Error(`No time`)
  else if ([
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.announcement,
  ].includes(item.type) && !item.nameGist) throw new Error(`No name/name field`)
  else if (!item.status) throw new Error(`No status`)
  else if (!item.type) throw new Error(`No type`)

  if (!moment(`${item.date} ${item.time}`).isValid())
    throw new Error(`Incorrect date: ${item.date}`)
  else if (!Object.values(CONTENT_STATUS).includes(item.status))
    throw new Error(`Unknown status: ${item.status}`)
  else if (!Object.values(PUBLICATION_TYPES).includes(item.type))
    throw new Error(`Unknown type: ${item.type}`)
}

export function prepareContentItem(
  rawItem: PageObjectResponse,
  i18n: typeof ru
): ContentItem {
  const parsedContentItem: ContentItem = parseContentItem(rawItem)

  try {
    validateContentItem(parsedContentItem)
  }
  catch (e) {
    throw new Error(i18n.errors.invalidContent + e)
  }

  return parsedContentItem
}
