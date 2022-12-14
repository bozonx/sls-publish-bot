import RawPageContent, {PAGE_CONTENT_PROPS} from '../types/PageContent.js';
import ru from '../I18n/ru.js';
import {BlockObjectResponse, PageObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NotionBlocks} from '../types/notion.js';
import {makeTagsString} from '../lib/common.js';
import {PUBLICATION_TYPES, PublicationType} from '../types/publicationType.js';


export function parsePageContent(
  props: Record<string, any>,
  textBlocks: Record<string, BlockObjectResponse[]>
): RawPageContent {
  return {
    title: props[PAGE_CONTENT_PROPS.title]?.title[0]?.plain_text,
    announcement: props[PAGE_CONTENT_PROPS.announcement]?.rich_text[0]?.plain_text,
    imageDescr: props[PAGE_CONTENT_PROPS.imageDescr]?.rich_text[0]?.plain_text,
    instaTags: props[PAGE_CONTENT_PROPS.instaTags]?.multi_select.map((el: any) => el.name),
    tgTags: props[PAGE_CONTENT_PROPS.tgTags]?.multi_select.map((el: any) => el.name),
    textBlocks,
  };
}

export function makePageDetailsMsg(pageContent: RawPageContent, i18n: typeof ru): string {
  const instaTags = makeTagsString(pageContent.instaTags);

  return `${i18n.pageInfo.title}: ${pageContent.title}\n`
   + `${i18n.pageInfo.announcement}: ${pageContent.announcement}\n`
   + `${i18n.pageInfo.imageDescr}: ${pageContent.imageDescr}\n`
   + `${i18n.pageInfo.tgTags}: ${makeTagsString(pageContent.tgTags)}\n`
   + `${i18n.pageInfo.instaTags}: ${instaTags}`
}

export function validatePageItem(
  pubType: PublicationType,
  pageContent: RawPageContent,
  i18n: typeof ru
) {
  if (pubType === PUBLICATION_TYPES.article && !pageContent.title) {
    throw i18n.errors.noTitle;
  }
}

export function preparePage(
  pubType: PublicationType,
  pageProperties: PageObjectResponse['properties'],
  pageContent: NotionBlocks,
  i18n: typeof ru
): RawPageContent {
  const parsedPage = parsePageContent(pageProperties, pageContent);

  try {
    validatePageItem(pubType, parsedPage, i18n);
  }
  catch (e) {
    throw new Error(i18n.errors.invalidPage + e);
  }

  return parsedPage;
}
