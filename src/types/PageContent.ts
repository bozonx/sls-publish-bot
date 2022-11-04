import {NOTION_BLOCKS} from './types';


// props of notion page
export const PAGE_CONTENT_PROPS = {
  title: 'title',
  announcement: 'announcement',
  imageDescr: 'imageDescr',
  instaTags: 'instaTags',
  tgTags: 'tgTags',
  image: 'image',
}

// TODO: rename
export default interface RawPageContent {
  title: string;
  announcement: string;
  imageDescr: string;
  instaTags: string[];
  tgTags: string[];
  imageUrl?: string;
  imageBaseName?: string;
  imageExt?: string;
  textBlocks: NOTION_BLOCKS;
}
