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
    tags: string[]
    postTemplate: string
    // links which were mentioned in content
    contentLinks: string
    postFooter: string
    articleFooter: string
    pubDateTime: string
  },
  tg?: {
    preview?: boolean
    urlButton?: string
    autoRemove?: string

    tags?: string[]
    postTemplate?: string
    contentLinks?: string
    postFooter?: string
    pubDateTime?: string
  },
  youtube?: {
    tags: string[]
    postTemplate?: string
    contentLinks?: string
    postFooter?: string
    pubDateTime?: string
  },
  dzen?: {
    tags: string[]
    postTemplate?: string
    contentLinks?: string
    postFooter?: string
    pubDateTime?: string
  },
  podcast?: {
    tags: string[]
    postTemplate?: string
    contentLinks?: string
    footer?: string
    pubDateTime?: string
  }
}
