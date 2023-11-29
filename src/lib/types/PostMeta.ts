import type {PostTypes} from '$lib/constants';
import type {ALL_SNS} from '$lib/constants';


export interface PostMeta {
  postId: string
  // heading of the post or article
  title: string
  // URL compatible transliterated name of post or article
  urlName: string
  type: PostTypes
  descr?: string
  timeCodes?: string
  sns: (keyof typeof ALL_SNS)[]

  images?: string[]
  common: {
    tags: string[]
    postTemplate: string
    articleTemplate: string
    // links which were mentioned in content
    contentLinks: string
    postFooter: string
    articleFooter: string
    pubDateTime: string
  },
  telegram?: {
    preview?: boolean
    urlButton?: string
    autoRemove?: string

    tags?: string[]
    postTemplate?: string
    articleTemplate?: string
    contentLinks?: string
    postFooter?: string
    articleFooter?: string
    pubDateTime?: string
  },
  youtube?: {
    tags?: string[]
    template?: string
    contentLinks?: string
    footer?: string
    pubDateTime?: string
  },
  podcast?: {
    tags?: string[]
    template?: string
    contentLinks?: string
    footer?: string
    pubDateTime?: string
  },
  dzen?: {
    template?: string
    footer?: string
    pubDateTime?: string
  },
}
