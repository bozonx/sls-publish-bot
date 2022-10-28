import {MdBlock} from 'notion-to-md/build/types';
import {SectionTypes} from './types';


export default interface Sections {
  Type: SectionTypes;
  Header: string,
  MainImage?: string;
  MainImageDescr?: string;
  TgTags?: string[];
  InstaPostTags?: string[];
  // TODO: setup type
  PostText?: Record<string, any>[],
  ArticleText?: MdBlock[],
}
