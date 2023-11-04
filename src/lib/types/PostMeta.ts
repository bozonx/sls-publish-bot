import type {PostTypes} from '$lib/constants';


export interface PostMeta {
  // unique file name of post to publish of certain blog.
  fileName: string
  // heading of the post or article
  title: string
  // URL compatible transliterated name of post or article
  urlName: string
  type: PostTypes
  pubDate: string
  pubTime: string
  articleCustomFooter?: string
  images?: string[]
  publication: {
    common?: string
    tg?: string
    dzen?: string
    podcast?: string
    youtube?: string
  }
  tags?: {
    common?: string[]
    tg?: string[]
    insta?: string[]
    podcast?: string[]
    youtube?: string[]
  }
  tg: {
    preview?: boolean
    urlButton?: string
    autoRemove?: string
    postCustomFooter?: string
  }
}
