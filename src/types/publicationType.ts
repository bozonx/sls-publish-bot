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
  | 'video'

export const PUBLICATION_TYPES: Record<PublicationType, PublicationType> = {
  article: 'article',
  post1000: 'post1000',
  post2000: 'post2000',
  photos: 'photos',
  narrative: 'narrative',
  announcement: 'announcement',
  poll: 'poll',
  mem: 'mem',
  story: 'story',
  reels: 'reels',
  video: 'video',
}
