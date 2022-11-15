import _ from 'lodash';
import ContentItem, {
  CONTENT_PROPS,
  CONTENT_STATUS,
} from '../types/ContentItem';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import moment from 'moment';
import {makeDateTimeStr, makeFullNotionLink} from '../helpers/helpers';
import ru from '../I18n/ru';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType';


// TODO: review, refactor


export function parseContentItem(item: PageObjectResponse): ContentItem {
  const pubType: PublicationType = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';
  const link = (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.href;
  const relativePageId: string | undefined = (link)
    // TODO: а если передана полная ссылка ????
    ? _.trimStart(link, '/')
    : undefined;

  return {
    // date in iso format
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    gist: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.plain_text || '',
    relativePageId,
    note: (item.properties[CONTENT_PROPS.note] as any)?.title[0]?.plain_text || '',
    status: (item.properties[CONTENT_PROPS.status] as any)?.select.name || '',
    onlySn: (item.properties[CONTENT_PROPS.onlySn] as any)?.multi_select
      .map((el: any) => el.name) || [],
    type: pubType,
  }
}

export function makeContentPlanItemDetails(item: ContentItem, i18n: typeof ru, utcOffset: number): string {
  return `${i18n.contentInfo.dateTime}: ${makeDateTimeStr(item.date, item.time, utcOffset)}\n`
    + `${i18n.contentInfo.onlySn}: `
      + `${(item.onlySn.length) ? item.onlySn.join(', ') : i18n.contentInfo.noRestriction}\n`
    + `${i18n.contentInfo.type}: ${item.type}\n`
    + `${i18n.contentInfo.status}: ${item.status}\n`
    + `${i18n.contentInfo.content}: ${item.gist}\n`
    + `${i18n.contentInfo.link}: ${(item.relativePageId) ? makeFullNotionLink(item.relativePageId) : ''}\n`
    + `${i18n.contentInfo.note}: ${item.note}`;
}

export function validateContentItem(item: ContentItem) {
  if (!item.date) throw new Error(`No date`);
  else if (!item.time) throw new Error(`No time`);
  else if (!item.gist && !item.relativePageId) throw new Error(`No gist and link`);
  else if (!item.status) throw new Error(`No status`);
  else if (!item.type) throw new Error(`No type`);

  if (!moment(`${item.date} ${item.time}`).isValid())
    throw new Error(`Incorrect date: ${item.date}`);
  else if (!Object.values(CONTENT_STATUS).includes(item.status))
    throw new Error(`Unknown status: ${item.status}`);
  else if (!Object.values(PUBLICATION_TYPES).includes(item.type))
    throw new Error(`Unknown type: ${item.type}`);
  else if ([
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.poll,
  ].includes(item.type) && !item.relativePageId)
    throw new Error(`No relative page id`);
}

export function prepareContentItem(
  rawItem: PageObjectResponse,
  i18n: typeof ru
): ContentItem {
  const parsedContentItem: ContentItem = parseContentItem(rawItem);

  try {
    validateContentItem(parsedContentItem);
  }
  catch (e) {
    throw new Error(i18n.errors.invalidContent + e);
  }

  return parsedContentItem;
}
