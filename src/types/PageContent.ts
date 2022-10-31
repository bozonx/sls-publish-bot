import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints';


export default interface RawPageContent {
  title: string;
  announcement: string;
  imageDescr: string;
  instaTags: string[];
  tgTags: string[];
  textMd: BlockObjectResponse[];
}
