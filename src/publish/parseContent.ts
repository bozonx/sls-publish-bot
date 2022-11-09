import ContentItem, {
  CONTENT_PROPS,
  CONTENT_STATUS,
  PUBLICATION_TYPES,
  PublicationTypes,
  SnTypes
} from '../types/ContentItem';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import moment from 'moment';
import {makeDateTimeStr, makeFullNotionLink, matchSnsForType, resolveSns} from '../helpers/helpers';
import ru from '../I18n/ru';
import _ from 'lodash';
import {PRINT_FULL_DATE_FORMAT} from '../types/constants';
import TgChat from '../apiTg/TgChat';


// TODO: review, refactor


export function parseContentItem(item: PageObjectResponse): ContentItem {
  const pubType: PublicationTypes = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';
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
    + `${i18n.contentInfo.onlySn}: ${item.onlySn.join(', ')}\n`
    + `${i18n.contentInfo.type}: ${item.type}.\n`
    + `${i18n.contentInfo.status}: ${item.status}\n`
    + `${i18n.contentInfo.content}: ${item.gist}\n`
    + `${i18n.contentInfo.link}: ${(item.relativePageId) ? makeFullNotionLink(item.relativePageId) : ''}\n`
    + `${i18n.contentInfo.note}: ${item.note}`;
}

export function validateContentItem(item: ContentItem) {
  if (!item.date) throw new Error(`No date`);
  if (!item.time) throw new Error(`No time`);
  if (!item.gist && !item.relativePageId) throw new Error(`No gist and link`);
  if (!item.status) throw new Error(`No status`);
  if (!item.type) throw new Error(`No type`);

  if (!moment(`${item.date} ${item.time}`).isValid())
    throw new Error(`Incorrect date: ${item.date}`);
  if (!Object.values(CONTENT_STATUS).includes(item.status))
    throw new Error(`Unknown status: ${item.status}`);
  if (!Object.values(PUBLICATION_TYPES).includes(item.type))
    throw new Error(`Unknown type: ${item.type}`);
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
