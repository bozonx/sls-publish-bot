export interface BlogConfig {
  telegraph: {
    token: string
    authorName: string
    authorUrl: string
  }
  telegram: {
    channelId: string
    supportedTypes: string[]
    articlePostTmpl: string
    postFooter: string
    articleFooter: string
  }
  dzen: {
    postFooter: string
    articleFooter: string
  }
}
