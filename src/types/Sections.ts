import {MdBlock} from 'notion-to-md/build/types';


export default interface Sections {
  MainImage: string;
  MainImageDescr: string;
  Header: string,
  TgTags: string[];
  InstaPostTags: string[];
  PostText: MdBlock[],
  ArticleText: MdBlock[],
}
