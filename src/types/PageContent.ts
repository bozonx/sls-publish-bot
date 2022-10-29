import {MdBlock} from 'notion-to-md/build/types';
''
export default interface RawPageContent {
  title: string;
  announcement: string;
  imageDescr: string;
  instaTags: string[];
  tgTags: string[];
  textMd: MdBlock[];
}
