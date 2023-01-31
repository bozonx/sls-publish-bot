import {SnType} from './snTypes.js';
import {PublicationType} from './publicationType.js';


export const CONTENT_PROPS = {
  date: 'date',
  time: 'time',
  nameGist: 'name/gist',
  note: 'note',
  status: 'status',
  onlySn: 'onlySn',
  type: 'type',
}

export const CONTENT_STATUS = {
  to_write: 'to_write',
  to_edit: 'to_edit',
  to_correct: 'to_correct',
  to_publish: 'to_publish',
  published: 'published',
};

export type ContentStatus = 'to_write'
  | 'to_edit'
  | 'to_correct'
  | 'to_publish'
  | 'published';

export default interface ContentItem {
  // date in ISO format
  date: string;
  time: string;
  nameGist?: string;
  note: string;
  status: ContentStatus,
  onlySn: SnType[],
  type: PublicationType,
  // additional
  imageDescr?: string
  tgTags?: string[]
  instaTags?: string[]
}
