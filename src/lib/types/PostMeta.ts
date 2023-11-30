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
    // links which were mentioned in content
    contentLinks: string
    pubDateTime: string
  },
  telegram?: {
    preview?: boolean
    urlButton?: {
      text: string
      url: string
    }
    pubDateTime?: string
    autoRemove?: string
    tags?: string[]

    useCustomLinks?: boolean
    contentLinks?: string
    useCustomTemplate?: boolean
    postTemplate?: string
    articleTemplate?: string
    useCustomFooter?: boolean
    postFooter?: string
    articleFooter?: string
  },
  youtube?: {
    pubDateTime?: string
    tags?: string[]
    useCustomLinks?: boolean
    contentLinks?: string
    useCustomTemplate?: boolean
    template?: string
    useCustomFooter?: boolean
    footer?: string
  },
  dzen?: {
    pubDateTime?: string
    useCustomTemplate?: boolean
    template?: string
    useCustomFooter?: boolean
    footer?: string
  },
  podcast?: {
    pubDateTime?: string
    tags?: string[]
    useCustomLinks?: boolean
    contentLinks?: string
    useCustomTemplate?: boolean
    template?: string
    useCustomFooter?: boolean
    footer?: string
  },
}
