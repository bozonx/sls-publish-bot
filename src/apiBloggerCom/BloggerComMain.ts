import {blogger_v3, google} from 'googleapis'


interface AccessJson {
  clientId: string,
  clientSecret: string,
  access_token: string,
  refresh_token: string,
}


export default class BloggerComMain {
  private readonly accessObj: AccessJson
  private blogger!: blogger_v3.Blogger


  constructor(accessObjStr: string) {
    this.accessObj = JSON.parse(accessObjStr)
  }

  async init() {
    const oauth2Client = new google.auth.OAuth2(
      this.accessObj.clientId,
      this.accessObj.clientSecret,
      'https://oauth2.googleapis.com/token'
    )

    oauth2Client.setCredentials({
      access_token: this.accessObj.access_token,
      refresh_token: this.accessObj.refresh_token,
    })

    this.blogger = new blogger_v3.Blogger({ auth: oauth2Client })
  }

  async createPost(
    blogId: string,
    title: string,
    content: string,
    // like '2023-02-24T13:05:00+03:00'
    publishIsoDateTime: string,
    labels?: string[],
    isDraft = false
  ): Promise<blogger_v3.Schema$Post> {
    const res = await this.blogger.posts.insert({
      blogId,
      isDraft,
      requestBody: {
        title,
        content,
        labels,
        published: publishIsoDateTime,
        // "images": [
        //   {
        //     "url": string
        //
        //
        //   }
        // ],
      }
    })

    if (res.status !== 200) {
      throw new Error(`Can't create a new post on blogger.com: ${res.status} ${res.statusText}`)
    }

    return res.data
  }
}


// (async () => {
//   const bloggerCom = new BloggerComMain(
//     process.env['GOOGLE_API_TOKENS'] || '{}',
//   )
//
//   await bloggerCom.init()
//   await bloggerCom.createPost('', '', '')
// })()
