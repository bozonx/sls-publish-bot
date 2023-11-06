import type {PostTypes, ALL_SNS} from '$lib/constants';


export interface PostMeta {
  // unique file name of post to publish of certain blog.
  fileName: string
  // heading of the post or article
  title: string
  // URL compatible transliterated name of post or article
  urlName: string
  type: PostTypes
  descr?: string
  timeCodes?: string

  images?: string[]
  // TODO: наверное убрать
  sns: (keyof typeof ALL_SNS)[]
  common: {
    // links which were mentioned in content
    contentLinks: string
    tags: string[]
    postFooter: string
  },
  tg?: {
    tags: string[]
    preview?: boolean
    urlButton?: string
    autoRemove?: string
    postCustomFooter?: string
    pubDateTime: string
  },
  youtube?: {
    contentLinks: string
    tags: string[]
    footer: string
    pubDateTime: string
  },
}
