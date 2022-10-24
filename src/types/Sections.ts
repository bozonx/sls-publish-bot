import {MdBlock} from 'notion-to-md/build/types';


export default interface Sections {
  MainImage: string;
  MainImageDescr: string;
  Header: string,
  PostText: MdBlock[],
  ArticleText: MdBlock[],
  TgTags: string[];
  InstaPostTags: string[];
}
