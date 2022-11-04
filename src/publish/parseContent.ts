import ContentItem, {
  CONTENT_PROPS,
  CONTENT_STATUS,
  PUBLICATION_TYPES,
  PublicationTypes,
  SnTypes
} from '../types/ContentItem';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import moment from 'moment';
import {makeFullNotionLink, matchSnsForType} from '../helpers/helpers';
import ru from '../I18n/ru';
import _ from 'lodash';
import {FULL_DATE_FORMAT} from '../types/constants';


// TODO: review, refactor


export function parseContentItem(item: PageObjectResponse, channelSns: SnTypes[]): ContentItem {
  const pubType: PublicationTypes = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';
  const link = (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.href;
  const relativePageId: string | undefined = (link)
    // TODO: а если передана полная ссылка ????
    ? _.trimStart(link, '/')
    : undefined;

  return {
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    gist: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.plain_text || '',
    relativePageId,
    note: (item.properties[CONTENT_PROPS.note] as any)?.title[0]?.plain_text || '',
    status: (item.properties[CONTENT_PROPS.status] as any)?.select.name || '',
    sns: resolveSns(
      channelSns,
      (item.properties[CONTENT_PROPS.onlySn] as any)?.multi_select
        .map((el: any) => el.name) || [],
      pubType
    ),
    type: pubType,
  }
}

export function makeContentPlanItemDetails(item: ContentItem, i18n: typeof ru): string {
  return `${i18n.contentInfo.dateTime}: ${moment(item.date).format(FULL_DATE_FORMAT)} ${item.time}\n`
    + `${i18n.contentInfo.sns}: ${item.sns.join(', ')}\n`
    + `${i18n.contentInfo.type}: ${item.type}. ${i18n.contentInfo.status}: ${item.status}\n`
    + `${i18n.contentInfo.content}: ${item.gist}\n`
    + `${i18n.contentInfo.link}: ${(item.relativePageId) ? makeFullNotionLink(item.relativePageId) : ''}\n`
    + `${i18n.contentInfo.note}: ${item.note}`;
}

export function resolveSns(
  channelSns: SnTypes[],
  onlySns: SnTypes[],
  pubType: PublicationTypes
): SnTypes[] {
  let preSns = []

  if (onlySns.length) {
    preSns = onlySns;
  }
  else {
    preSns = matchSnsForType(pubType);
  }

  return _.intersection(channelSns, preSns);
}

export function validateContentItem(item: ContentItem) {
  if (!item.date) throw new Error(`No date`);
  if (!item.time) throw new Error(`No time`);
  if (!item.gist && !item.relativePageId) throw new Error(`No gist and link`);
  if (!item.status) throw new Error(`No status`);
  if (!item.type) throw new Error(`No type`);
  if (!item.sns.length) throw new Error(`No social networks`);

  if (!moment(`${item.date} ${item.time}`).isValid())
    throw new Error(`Incorrect date: ${item.date}`);
  if (!Object.values(CONTENT_STATUS).includes(item.status))
    throw new Error(`Unknown status: ${item.status}`);
  if (!Object.values(PUBLICATION_TYPES).includes(item.type))
    throw new Error(`Unknown type: ${item.type}`);
}
