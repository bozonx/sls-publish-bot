import type {PageLoad} from './$types'
import {squidletAppApi} from '$lib/squidletAppApi';
import {TO_PUBLISH_DIR} from '$lib/constants';


export const load: PageLoad = async (event) => {
  return {
    blog: (await squidletAppApi.loadBlogData(event.params.blog)).result,
    postResp: await squidletAppApi.loadBlogPosts(event.params.blog, TO_PUBLISH_DIR),
  }
}
