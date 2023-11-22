import type {PageLoad} from './$types'
import {squidletAppApi} from '$lib/squidletAppApi';


export const load: PageLoad = async (event) => {
  return {
    blog: (await squidletAppApi.loadBlogData(event.params.blog)).result,
    post: await squidletAppApi.loadBlogPostItem(
      event.params.blog,
      event.url.searchParams.get('postid')
    ),
  }
}
