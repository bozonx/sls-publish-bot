import _ from 'lodash';
import path from 'path';
import RawPageContent, {PAGE_CONTENT_PROPS} from '../types/PageContent';
import ru from '../I18n/ru';
import {makeTagsString} from '../helpers/helpers';
import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {transformNotionToCleanText} from '../helpers/transformNotionToCleanText';


export function parsePageContent(
  props: Record<string, any>,
  textBlocks: Record<string, BlockObjectResponse[]>
): RawPageContent {
  const imageName: string | undefined = props[PAGE_CONTENT_PROPS.image]?.files[0]?.name;
  const imageExt = imageName && _.trimStart(path.extname(imageName), '.');

  return {
    title: props[PAGE_CONTENT_PROPS.title]?.title[0]?.plain_text,
    announcement: props[PAGE_CONTENT_PROPS.announcement]?.rich_text[0]?.plain_text,
    imageDescr: props[PAGE_CONTENT_PROPS.imageDescr]?.rich_text[0]?.plain_text,
    instaTags: props[PAGE_CONTENT_PROPS.instaTags]?.multi_select.map((el: any) => el.name),
    tgTags: props[PAGE_CONTENT_PROPS.tgTags]?.multi_select.map((el: any) => el.name),
    imageUrl: props[PAGE_CONTENT_PROPS.image]?.files[0]?.file.url,
    imageBaseName: imageName && path.basename(imageName, '.' + imageExt),
    imageExt,
    textBlocks,
  };
}

export function makePageDetailsMsg(pageContent: RawPageContent, i18n: typeof ru): string {
  const instaTags = makeTagsString(pageContent.instaTags);

  return `${i18n.pageInfo.title}: ${pageContent.title}\n`
   + `${i18n.pageInfo.announcement}: ${pageContent.announcement}\n`
   + `${i18n.pageInfo.imageDescr}: ${pageContent.imageDescr}\n`
   + `${i18n.pageInfo.tgTags}: ${makeTagsString(pageContent.tgTags)}\n`
   + `${i18n.pageInfo.instaTags}: ${instaTags}\n`
   + `${i18n.pageInfo.contentLength}: ` +
     transformNotionToCleanText(pageContent.textBlocks).length + '\n'
   + `${i18n.pageInfo.contentLengthWithTags}: ` +
    (transformNotionToCleanText(pageContent.textBlocks) + '\n\n' + instaTags).length;
}

export function validatePageItem(pageContent: RawPageContent) {
  // TODO: add
}
