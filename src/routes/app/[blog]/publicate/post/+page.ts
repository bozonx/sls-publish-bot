import type {PageLoad} from './$types'
import {squidletAppApi} from '$lib/squidletAppApi';


export const load: PageLoad = async (event) => {
  return await squidletAppApi.loadBlogPostItem(
    event.params.blog,
    event.url.searchParams.get('item')
  )
}
