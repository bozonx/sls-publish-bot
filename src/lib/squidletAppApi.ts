import type {BlogMeta} from '$lib/types/BlogMeta';
import type {ListResponse} from '$lib/types/ListResponse';
import type {PostResult} from '$lib/types/PostResult';
import type {ItemResponse} from '$lib/types/ItemResponse';


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