import type {BlogMeta} from '$lib/types/BlogMeta';
import type {ListResponse} from '$lib/types/ListResponse';
import type {PostResult} from '$lib/types/PostResult';
import type {ItemResponse} from '$lib/types/ItemResponse';
import { UiApiMain } from './squidletUi/squidletAppApiConnection';
import {browser} from '$app/environment';


// TODO: get from squildlet
const DEFAULT_HOST = 'localhost'
// TODO: get from squildlet
const DEFAULT_PORT = 41811
let squidletUi: UiApiMain | undefined



(async () => {
  if (browser) {
    const WsClass: new (url: string, protocol: string) => WebSocket = WebSocket
    // TODO: может лучше из env брать
    // @ts-ignore
    const wsHost = window.SQUIDLET_API_HOST || DEFAULT_HOST
    // @ts-ignore
    const wsPort = window.SQUIDLET_API_PORT || DEFAULT_PORT

    squidletUi = new UiApiMain(wsHost, wsPort, WsClass)

    //await squidletUi?.start()
  }
})()

const testData = {
  allBlogs: {
    result: [
      {
        name: 'plibereco',
        title: 'Система Личной Свободы RU',
        lang: 'ru',
      },
    ],
    pageNum: 1,
    perPage: 10,
    totalPages: 1,
  },
  blog: {
    name: 'plibereco',
    title: 'Система Личной Свободы RU',
    lang: 'ru',
  },
  posts: {
    result: [
      {
        meta: {
          fileName: 'post_1.md',
          title: 'Post 1',
          urlName: 'post-1',
        },
        md: 'post content',
      },
    ],
    pageNum: 1,
    perPage: 10,
    totalPages: 1,
  },
}


export const squidletAppApi = {
  async loadAllBlogs(): Promise<ListResponse<BlogMeta>> {

    // TODO: do it
    const resp = await squidletUi?.send({
      requestId: 'req',
    })

    console.log(444, resp)

    return testData.allBlogs
  },

  async loadBlogData(blogName: string): Promise<BlogMeta> {
    return testData.blog
  },

  async loadBlogPosts(blogName: string): Promise<ListResponse<PostResult>> {
    return testData.posts
  },

  async loadBlogPostItem(blogName: string, postFileName: string): Promise<ItemResponse<PostResult>> {
    return {result: testData.posts.result[0]}
  },
}
