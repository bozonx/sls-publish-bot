import {blogger_v3, google} from 'googleapis'


export default class BloggerComMain {
  private readonly gapiTokens: {access_token: string, refresh_token: string}
  private readonly bloggerBlogId: string


  constructor(gapiTokensStr: string, bloggerBlogId: string) {
    this.gapiTokens = JSON.parse(gapiTokensStr)
    this.bloggerBlogId = bloggerBlogId
  }

  async init() {
    const oauth2Client = new google.auth.OAuth2()

    oauth2Client.setCredentials(this.gapiTokens)

    const blogger = new blogger_v3.Blogger({ auth: oauth2Client })

    // const blog = await blogger.blogs.get({
    //   blogId: this.bloggerBlogId,
    // });

    const res = await blogger.posts.insert(
      {
        blogId: this.bloggerBlogId,
        isDraft: true,
        requestBody: {
          title: 'test1',
          content: '<p>test <b>bold</b></p>',
          // "images": [
          //   {
          //     "url": string
          //
          //
          //   }
          // ],
          // customMetaData
          // labels[]
          // published

        }
      },
    )

    console.log(111, res)

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
