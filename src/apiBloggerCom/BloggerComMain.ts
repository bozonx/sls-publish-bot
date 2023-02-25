import {OAuth2Client} from 'google-auth-library'
import {GaxiosError} from 'gaxios'

/**
 * See
 * * https://www.npmjs.com/package/google-auth-library
 * * https://developers.google.com/blogger/docs/3.0/using?hl=ru#AddingAPost
 * * https://developers.google.com/blogger/docs/3.0/reference/posts/insert?hl=ru
 * * https://console.cloud.google.com/apis/credentials
 */


interface BloggerResponseData {
  kind: 'blogger#post'
  id: string
  // 'DRAFT'
  status: string,
  blog: { id: string },
  // like 2023-02-25T11:44:00+03:00
  published: string
  // like 2023-02-25T11:44:36+03:00
  updated: string
  // is http://blog.slsfreedom.org/
  url: string
  // like https://www.googleapis.com/blogger/v3/blogs/4309559355980291324/posts/8324745815131022600
  selfLink: string
  title: string
  content: string
}

interface AccessJson {
  clientId: string,
  clientSecret: string,
  refreshToken: string,
}


export default class BloggerComMain {
  private readonly accessObj: AccessJson
  private client!: OAuth2Client


  constructor(accessObjStr: string) {
    this.accessObj = JSON.parse(accessObjStr)
  }

  async init() {
    this.client = await this.doAuth()
  }

  async createPost(
    blogId: string,
    title: string,
    content: string,
    // like '2023-02-24T13:05:00+03:00'
    publishIsoDateTime?: string,
    labels?: string[],
    isDraft = false
  ): Promise<BloggerResponseData> {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`
    const data = {
      title,
      content,
      labels,
      published: publishIsoDateTime,
      // images: [
      //   {
      //     url: 'https://telegra.ph/file/bbdc3eba69247e60553d8.jpg',
      //   }
      // ],
    }

    return this.doPostRequest(url, data, isDraft)
  }

  private async doPostRequest(
    url: string,
    data: Record<string, any>,
    isDraft?: boolean
  ): Promise<BloggerResponseData> {
    try {
      const res = await this.client.request({
        url,
        method: 'POST',
        responseType: 'json',
        params: { isDraft },
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      })

      return res.data as BloggerResponseData
    }
    catch (e) {
      const gaxiosErr = e as GaxiosError

      throw new Error(`Status: ${gaxiosErr.response?.status}, ${gaxiosErr.response?.statusText}`)
    }

  }

  private async doAuth(): Promise<OAuth2Client> {
    const oAuth2Client = new OAuth2Client(
      this.accessObj.clientId,
      this.accessObj.clientSecret,
      'https://oauth2.googleapis.com/token'
    )

    oAuth2Client.setCredentials({
      refresh_token: this.accessObj.refreshToken
    })

    // // Generate the url that will be used for the consent dialog.
    // const authorizeUrl = oAuth2Client.generateAuthUrl({
    //   access_type: 'offline',
    //   scope: 'https://www.googleapis.com/auth/userinfo.profile',
    // });
    // console.log(authorizeUrl)

    return oAuth2Client
  }

}




// (async () => {
//   const bloggerCom = new BloggerComMain(
//     process.env['GOOGLE_API_TOKENS'] || '{}',
//   )
//
//   await bloggerCom.init()
//   await bloggerCom.createPost(
//     '4309559355980291324',
//     'some title',
//     '<p>some content <img src="https://telegra.ph/file/bbdc3eba69247e60553d8.jpg" /></p>',
//     '2023-02-28T13:05:00+03:00',
//     undefined,
//     false
//   )
// })()
