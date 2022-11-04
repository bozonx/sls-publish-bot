import RawPageContent, {PAGE_CONTENT_PROPS} from '../types/PageContent';
import ru from '../I18n/ru';
import {makeTagsString} from '../helpers/helpers';
import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {transformNotionToCleanText} from '../helpers/transformNotionToCleanText';
import path from 'path';


// TODO: review, refactor

// image: { id: '%3A%3BpJ', type: 'files', files: [ [Object] ] },
//console.log(1111, (resultPage as any).properties.image.files)

/*
[
{
  name: 'IMG_20220827_201603_152.jpg',
  type: 'file',
  file: {
    url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cfa0c940-a96b-4d69-a65a-73ab4e98ae23/IMG_20220827_201603_152.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221104%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221104T161118Z&X-Amz-Expires=3600&X-Amz-Signature=fd40a4e90343f3b98a3a60e4c1afddfecbbdf8fd3d3968dafbf5ae26b2bdd1e4&X-Amz-SignedHeaders=host&x-id=GetObject',
    expiry_time: '2022-11-04T17:11:18.402Z'
  }
}
]

 */
// PageObjectResponse['properties']

export function parsePageContent(
  props: Record<string, any>,
  textBlocks: Record<string, BlockObjectResponse[]>
): RawPageContent {
  const imageName: string | undefined = props[PAGE_CONTENT_PROPS.image]?.files[0]?.name;

  return {
    title: props[PAGE_CONTENT_PROPS.title]?.title[0]?.plain_text,
    announcement: props[PAGE_CONTENT_PROPS.announcement]?.rich_text[0]?.plain_text,
    imageDescr: props[PAGE_CONTENT_PROPS.imageDescr]?.rich_text[0]?.plain_text,
    instaTags: props[PAGE_CONTENT_PROPS.instaTags]?.multi_select.map((el: any) => el.name),
    tgTags: props[PAGE_CONTENT_PROPS.tgTags]?.multi_select.map((el: any) => el.name),
    imageUrl: props[PAGE_CONTENT_PROPS.image]?.files[0]?.file.url,
    imageBaseName: imageName && path.basename(imageName),
    imageExt: imageName && path.extname(imageName),
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