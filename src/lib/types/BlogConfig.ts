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

    articleTemplate: string
    postTemplate: string
    postFooter: string
    articleFooter: string
  }
  youtube: {
    template: string
    footer: string
  }
  dzen: {
    articleTemplate: string
    postTemplate: string
    postFooter: string
    articleFooter: string
  }
  podcast: {
    template: string
    footer: string
  }
}
