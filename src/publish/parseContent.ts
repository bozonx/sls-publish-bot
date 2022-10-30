import ContentItem from '../types/ContentItem';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {CONTENT_PROPS, CONTENT_STATUS, FULL_DATE_FORMAT, PUBLICATION_TYPES} from '../types/consts';
import moment from 'moment';
import {makeFullNotionLink, matchSnsForType} from '../helpers/helpers';
import {PublicationTypes, SnTypes} from '../types/types';
import ru from '../I18n/ru';
import _ from 'lodash';


// TODO: review, refactor


export function parseContentItem(item: PageObjectResponse, channelSns: SnTypes[]): ContentItem {
  const pubType: PublicationTypes = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';

  return {
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    gist: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.plain_text || '',
    pageLink: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.href || '',
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

export function makeContentInfoMsg(item: ContentItem, i18n: typeof ru): string {
  return `${i18n.contentInfo.dateTime}: ${moment(item.date).format(FULL_DATE_FORMAT)} ${item.time}\n`
    + `${i18n.contentInfo.sns}: ${item.sns.join(', ')}\n`
    + `${i18n.contentInfo.type}: ${item.type}. ${i18n.contentInfo.status}: ${item.status}\n`
    + `${i18n.contentInfo.content}: ${item.gist}\n`
    + `${i18n.contentInfo.link}: ${(item.pageLink) ? makeFullNotionLink(item.pageLink) : ''}\n`
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
  if (!item.gist && !item.pageLink) throw new Error(`No gist and link`);
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
