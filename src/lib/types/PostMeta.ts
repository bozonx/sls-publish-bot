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

  images?: string[]
  sns: (keyof typeof ALL_SNS)[]
  articleFooter?: {
    common: string
    [index: string]: string
  }
  publication: {
    common: string
    [index: string]: string
  }
  tags?: {
    common: string[]
    [index: string]: string[]
  }
  tg: {
    preview?: boolean
    urlButton?: string
    autoRemove?: string
    postCustomFooter?: string
  }
}
