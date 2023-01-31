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
import {SnType} from '../types/snTypes.js';
import {makeContentLengthDetails} from './publishHelpers.js';
import {makeClearTextsFromNotion} from '../notionHelpers/makeClearTextsFromNotion.js';
import {NotionBlocks} from '../types/notion.js';


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

export async function makeContentPlanItemDetails(
  contentItem: ContentItem,
  i18n: typeof ru,
  utcOffset: number,
  resolvedSns: SnType[],
  pageBlocks?: NotionBlocks,
  footerTmplMd?: string
): Promise<string> {
  let cleanTexts: Partial<Record<SnType, string>> = {}

  if (contentItem.type !== PUBLICATION_TYPES.poll) {
    // make clear text if it isn't a poll
    cleanTexts = await makeClearTextsFromNotion(
      resolvedSns,
      contentItem.type,
      true,
      footerTmplMd,
      pageBlocks,
      contentItem.gist,
      contentItem.instaTags,
      contentItem.tgTags
    )
  }

  const result: string[] = [
    `${i18n.contentInfo.dateTime}: ${makeHumanDateTimeStr(contentItem.date, contentItem.time, utcOffset)}`,
    `${i18n.contentInfo.onlySn}: `
    + `${(contentItem.onlySn.length) ? contentItem.onlySn.join(', ') : i18n.contentInfo.noRestriction}`,
    `${i18n.contentInfo.type}: ${contentItem.type}`,
    `${i18n.contentInfo.status}: ${contentItem.status}`,
  ]

  if (contentItem.tgTags) {
    result.push(`${i18n.contentInfo.tgTags}: ${contentItem.tgTags.join(', ')}`)
  }

  if (contentItem.instaTags) {
    result.push(`${i18n.contentInfo.instaTags}: ${contentItem.instaTags.join(', ')}`)
  }

  if (contentItem.imageDescr) {
    result.push(`${i18n.contentInfo.imageDescr}: ${contentItem.imageDescr}`)
  }

  if (contentItem.name) {
    result.push(`${i18n.contentInfo.name}: ${contentItem.name}`)
  }

  if (contentItem.gist) {
    result.push(`${i18n.contentInfo.gist}: ${contentItem.gist}`)
  }

  result.push(`${i18n.contentInfo.note}: ${contentItem.note}`)

  // if (cleanTexts.telegram) {
  //   result.push(
  //     `${i18n.pageInfo.contentLength} + ${i18n.commonPhrases.footer}: `
  //     + cleanTexts.telegram.length
  //   )
  // }

  // TODO: если пусто ???
  if (cleanTexts.telegram || cleanTexts.instagram) {
    // TODO: use cleanFooterTmpl
    result.push(makeContentLengthDetails(i18n, cleanTexts, instaTags, tgFooter));
  }

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
