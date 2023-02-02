import {PUBLICATION_TYPES} from './publicationType.js';


export type SnType = 'telegram'
  | 'instagram'
  | 'zen'
  | 'blogger'
  | 'youtube'
  | 'tiktok'

export const SN_TYPES: Record<SnType, SnType> = {
  telegram: 'telegram',
  instagram: 'instagram',
  zen: 'zen',
  blogger: 'blogger',
  tiktok: 'tiktok',
  youtube: 'youtube',
}

export const SN_SUPPORT_TYPES = {
  [SN_TYPES.instagram]: [
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.narrative,
    PUBLICATION_TYPES.reels,
  ],
  [SN_TYPES.telegram]: [
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.story,
    PUBLICATION_TYPES.narrative,
    PUBLICATION_TYPES.announcement,
    PUBLICATION_TYPES.poll,
    PUBLICATION_TYPES.reels,
  ],
  [SN_TYPES.zen]: [
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.reels,
    PUBLICATION_TYPES.video,
  ],
  [SN_TYPES.blogger]: [
    PUBLICATION_TYPES.article,
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ],
  [SN_TYPES.youtube]: [
    PUBLICATION_TYPES.reels,
    PUBLICATION_TYPES.video,
  ],
  [SN_TYPES.tiktok]: [
    PUBLICATION_TYPES.reels,
  ],
};
