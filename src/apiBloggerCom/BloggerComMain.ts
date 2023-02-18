import {blogger_v3, google} from 'googleapis'


export default class BloggerComMain {
  private readonly gapiTokens: {access_token: string, refresh_token: string}
  private blogger!: blogger_v3.Blogger


  constructor(gapiTokensStr: string) {
    this.gapiTokens = JSON.parse(gapiTokensStr)
  }

  async init() {
    const oauth2Client = new google.auth.OAuth2()

    oauth2Client.setCredentials(this.gapiTokens)

    this.blogger = new blogger_v3.Blogger({ auth: oauth2Client })
  }

  async createPost(
    blogId: string,
    title: string,
    content: string,
    labels?: string[]
  ): Promise<blogger_v3.Schema$Post> {

    // const blog = await blogger.blogs.get({
    //   blogId: this.bloggerBlogId,
    // });

    const res = await this.blogger.posts.insert(
      {
        blogId,
        isDraft: true,
        requestBody: {
          title,
          content,
          labels,
          //content: '<p>0test <b>bold</b></p>',
          // "images": [
          //   {
          //     "url": string
          //
          //
          //   }
          // ],
          // customMetaData
          // published: '2023-02-18T13:05:00+03:00',

        }
      },
    )

    if (res.status !== 200) {
      throw new Error(`Can't create a new post on blogger.com: ${res.status} ${res.statusText}`)
    }

    return res.data
  }
}


// (async () => {
//   const bloggerCom = new BloggerComMain(
//     process.env['GOOGLE_API_TOKENS'] || '',
//     process.env['BLOGGER_BLOG_ID'] || '',
//   )
//
//   await bloggerCom.init()
// })()
