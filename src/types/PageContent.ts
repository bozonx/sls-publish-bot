import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints';


export const PAGE_CONTENT_PROPS = {
  title: 'title',
  announcement: 'announcement',
  imageDescr: 'imageDescr',
  instaTags: 'instaTags',
  tgTags: 'tgTags',
  textBlocks: 'textBlocks',
}

export default interface RawPageContent {
  title: string;
  announcement: string;
  imageDescr: string;
  instaTags: string[];
  tgTags: string[];
  textBlocks: Record<string, BlockObjectResponse[]>;
}
