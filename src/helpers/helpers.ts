import BaseState from '../types/BaseState';
import {PublicationTypes, SnTypes} from '../types/types';
import {PUBLICATION_TYPES, SN_TYPES} from '../types/consts';


export function makeBaseState(): BaseState {
  return {
    messageId: -1,
    handlerIndexes: [],
  };
}

export function makeTagsString(tags: string[]): string {
  return tags.map((item) => `#${item}`).join(' ');
}

export function nameFullNotionLink(internalLink: string): string {
  return `https://www.notion.so${internalLink}`
}

export function matchSnsForType(pubType: PublicationTypes): SnTypes[] {
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ].includes(pubType)) {
    return [
      SN_TYPES.telegram,
      SN_TYPES.instagram,
      SN_TYPES.zen,
      SN_TYPES.site,
    ];
  }
  if (pubType === PUBLICATION_TYPES.article) {
    return [SN_TYPES.telegram, SN_TYPES.zen];
  }
  else if (pubType === PUBLICATION_TYPES.story) {
    return [SN_TYPES.telegram, SN_TYPES.instagram];
  }
  else if (pubType === PUBLICATION_TYPES.announcement) {
    return [SN_TYPES.telegram];
  }
  else if (pubType === PUBLICATION_TYPES.poll) {
    return [SN_TYPES.telegram];
  }
  else if (pubType === PUBLICATION_TYPES.reels) {
    return [
      SN_TYPES.telegram,
      SN_TYPES.instagram,
      SN_TYPES.zen,
      SN_TYPES.youtube,
      SN_TYPES.tiktok,
    ];
  }
  else if (pubType === PUBLICATION_TYPES.video) {
    return [ SN_TYPES.youtube, SN_TYPES.zen ];
  }
  else {
    throw new Error(`Unsupported publication type`);
  }
}
