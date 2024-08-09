import type {PageLoad} from './$types'
import {squidletAppApi} from '$lib/squidletAppApi'
import {ARCHIVE_DIR} from '$lib/constants'


export const load: PageLoad = async (event) => {
  return {
    blog: (await squidletAppApi.loadBlogData(event.params.blog)).result,
    post: await squidletAppApi.loadBlogPostItem(
      event.params.blog,
      ARCHIVE_DIR,
      event.url.searchParams.get('postid')
    ),
  }
}
