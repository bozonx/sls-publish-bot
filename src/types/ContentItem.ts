import {ContentStatus, PublicationTypes, SnTypes} from './types';


export default interface ContentItem {
  date: string;
  time: string;
  gist: string;
  pageLink: string;
  note: string;
  status: ContentStatus,
  sns: SnTypes[],
  type: PublicationTypes,
}
