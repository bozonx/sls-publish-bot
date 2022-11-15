import {NOTION_BLOCKS} from './notion';


// TODO: rename
export default interface RawPageContent {
  title: string;
  announcement: string;
  imageDescr: string;
  instaTags: string[];
  tgTags: string[];
  textBlocks: NOTION_BLOCKS;
}

// props of notion page
export const PAGE_CONTENT_PROPS = {
  title: 'title',
  announcement: 'announcement',
  imageDescr: 'imageDescr',
  instaTags: 'instaTags',
  tgTags: 'tgTags',
  image: 'image',
}
