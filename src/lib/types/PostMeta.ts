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

    //postTemplate: string
    //articleTemplate: string
    //postFooter: string
    //articleFooter: string
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
    contentLinks?: string
    tags?: string[]
    useCustomTemplate?: boolean
    template?: string
    useCustomFooter?: boolean
    footer?: string
  },
  podcast?: {
    tags?: string[]
    template?: string
    contentLinks?: string
    footer?: string
    pubDateTime?: string
  },
  dzen?: {
    pubDateTime?: string
    useCustomTemplate?: boolean
    template?: string
    useCustomFooter?: boolean
    footer?: string
  },
}
