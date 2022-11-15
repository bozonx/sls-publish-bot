export type PublicationType = 'article'
  | 'post1000'
  | 'post2000'
  | 'mem'
  | 'photos'
  | 'story'
  | 'narrative'
  | 'announcement'
  | 'poll'
  | 'reels'
  | 'video';

export const PUBLICATION_TYPES: Record<PublicationType, PublicationType> = {
  article: 'article',
  post1000: 'post1000',
  post2000: 'post2000',
  mem: 'mem',
  photos: 'photos',
  story: 'story',
  narrative: 'narrative',
  announcement: 'announcement',
  poll: 'poll',
  reels: 'reels',
  video: 'video',
}
