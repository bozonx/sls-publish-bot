import ContentItem from '../types/ContentItem';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {CONTENT_PROPS, FULL_DATE_FORMAT} from '../types/consts';
import moment from 'moment';
import {matchSnsForType, nameFullNotionLink} from '../helpers/helpers';
import {PublicationTypes, SnTypes} from '../types/types';


export function parseContentItem(item: PageObjectResponse): ContentItem {
  const pubType: PublicationTypes = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';

  return {
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    gist: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.plain_text || '',
    pageLink: (item.properties[CONTENT_PROPS.gist] as any)?.rich_text[0]?.href || '',
    note: (item.properties[CONTENT_PROPS.note] as any)?.title[0]?.plain_text || '',
    status: (item.properties[CONTENT_PROPS.status] as any)?.select.name || '',
    sns: resolveSns(
      (item.properties[CONTENT_PROPS.onlySn] as any)?.multi_select
        .map((el: any) => el.name) || [],
      pubType
    ),
    type: pubType,
  }
}

export function makeContentInfoMsg(item: ContentItem): string {
  return `Date time: ${moment(item.date).format(FULL_DATE_FORMAT)} ${item.time}\n`
    + `Content: ${item.gist} ${nameFullNotionLink(item.pageLink)}\n`
    + `Type: ${item.type}. Status: ${item.status}\n`
    + `Social networks: ${item.sns.join(', ')}`
    + `\n\n${item.note}`;
}

export function resolveSns(onlySns: SnTypes[], pubType: PublicationTypes): SnTypes[] {
  if (onlySns.length) return onlySns;

  return matchSnsForType(pubType);
  // TODO: отфильтровать те что испльзуются в канале
}
