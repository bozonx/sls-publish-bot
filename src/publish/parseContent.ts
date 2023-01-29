import _ from 'lodash';
import moment from 'moment';
// @ts-ignore
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import ContentItem, {
  CONTENT_PROPS,
  CONTENT_STATUS,
} from '../types/ContentItem.js';
import {makeHumanDateTimeStr} from '../helpers/helpers.js';
import ru from '../I18n/ru.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';


export function parseContentItem(item: PageObjectResponse): ContentItem {
  const pubType: PublicationType = (item.properties[CONTENT_PROPS.type] as any)?.select.name || '';

  return {
    // date in iso format
    date: (item.properties[CONTENT_PROPS.date] as any)?.date.start || '',
    time: (item.properties[CONTENT_PROPS.time] as any)?.select.name || '',
    // TODO: выбрать взависимости от типа публикации
    name: (item.properties[CONTENT_PROPS.name] as any)?.title[0]?.plain_text || '',
    // TODO: выбрать взависимости от типа публикации
    gist: (item.properties[CONTENT_PROPS.name] as any)?.title[0]?.plain_text || '',
    note: (item.properties[CONTENT_PROPS.note] as any)?.rich_text[0]?.plain_text || '',
    status: (item.properties[CONTENT_PROPS.status] as any)?.select.name || '',
    onlySn: (item.properties[CONTENT_PROPS.onlySn] as any)?.multi_select
      .map((el: any) => el.name) || [],
    type: pubType,

    // TODO: add instaTags, tgTags, image descr
  }
}

export function makeContentPlanItemDetails(
  item: ContentItem,
  i18n: typeof ru,
  utcOffset: number,
  cleanFooterTmpl?: string
): string {
  const result: string[] = [
    `${i18n.contentInfo.dateTime}: ${makeHumanDateTimeStr(item.date, item.time, utcOffset)}`,
    `${i18n.contentInfo.onlySn}: `
    + `${(item.onlySn.length) ? item.onlySn.join(', ') : i18n.contentInfo.noRestriction}`,
    `${i18n.contentInfo.type}: ${item.type}`,
    `${i18n.contentInfo.status}: ${item.status}`,
  ]

  if (item.tgTags) {
    result.push(`${i18n.contentInfo.tgTags}: ${item.tgTags.join(', ')}`)
  }

  if (item.instaTags) {
    result.push(`${i18n.contentInfo.instaTags}: ${item.instaTags.join(', ')}`)
  }

  if (item.imageDescr) {
    result.push(`${i18n.contentInfo.imageDescr}: ${item.imageDescr}`)
  }

  if (item.name) {
    result.push(`${i18n.contentInfo.name}: ${item.name}`)
  }

  if (item.gist) {
    result.push(`${i18n.contentInfo.gist}: ${item.gist}`)
  }

  // TODO: add footer length
  // + ((state.useFooter) ? ` + ${tgChat.app.i18n.commonPhrases.footer}` : '')
  // + `: ${cleanFullText.length}\n`

  result.push(`${i18n.contentInfo.note}: ${item.note}`)

  // TODO: review
  // if (clearTexts) {
  //   // TODO: use cleanFooterTmpl
  //   await tgChat.reply(makeContentLengthString(
  //     tgChat.app.i18n,
  //     clearTexts,
  //     parsedContentItem.instaTags,
  //     footerStr
  //   ));
  // }

  return result.join('\n')
}

export function validateContentItem(item: ContentItem) {
  if (!item.date) throw new Error(`No date`);
  else if (!item.time) throw new Error(`No time`);
  // TODO: проверить gist и name только для article и accoucement и может poll
  // else if ([
  //   PUBLICATION_TYPES.article,
  //   PUBLICATION_TYPES.post1000,
  //   PUBLICATION_TYPES.post2000,
  //   PUBLICATION_TYPES.poll,
  // ].includes(item.type) && !item.relativePageId)
  //else if (!item.gist && !item.name) throw new Error(`No gist and link`);
  else if (!item.status) throw new Error(`No status`);
  else if (!item.type) throw new Error(`No type`);

  if (!moment(`${item.date} ${item.time}`).isValid())
    throw new Error(`Incorrect date: ${item.date}`);
  else if (!Object.values(CONTENT_STATUS).includes(item.status))
    throw new Error(`Unknown status: ${item.status}`);
  else if (!Object.values(PUBLICATION_TYPES).includes(item.type))
    throw new Error(`Unknown type: ${item.type}`);
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
