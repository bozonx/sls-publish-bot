import {MdBlock} from 'notion-to-md/build/types';


export default interface Sections {
  Type: 'Article' | 'Post1000' | 'Story';
  Header: string,
  MainImage?: string;
  MainImageDescr?: string;
  TgTags?: string[];
  InstaPostTags?: string[];
  // TODO: setup type
  PostText?: Record<string, any>[],
  ArticleText?: MdBlock[],
}
