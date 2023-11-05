import {SquidletAppApiConnection, APP_API_WS_PORT} from 'squidlet/SquidletAppApiConnection.js'
import {pathJoin} from 'squidlet-lib'
import {error} from '@sveltejs/kit'
import yaml from 'yaml'
import type {BlogMeta} from '$lib/types/BlogMeta'
import type {ListResponse} from '$lib/types/ListResponse'
import type {PostResult} from '$lib/types/PostResult'
import type {ItemResponse} from '$lib/types/ItemResponse'
import {browser} from '$app/environment'
import {BLOG_YAML, TO_PUBLISH_DIR} from '$lib/constants';
import {splitMdAndMeta} from '$lib/helpers';


// TODO: откуда её брать???
// TODO: нужен ли / ???
const PUBLISHER_ROOT_DIR = '/publisher'

// TODO: get from squildlet
const DEFAULT_API_HOST = 'localhost'
const DEFAULT_PORT = APP_API_WS_PORT
let squidletUi: SquidletAppApiConnection | undefined



(async () => {
  if (browser) {
    const WsClass: new (url: string, protocol: string) => WebSocket = WebSocket
    // TODO: может лучше из env брать
    // @ts-ignore
    const wsHost = window.SQUIDLET_API_HOST || DEFAULT_API_HOST
    // @ts-ignore
    const wsPort = window.SQUIDLET_API_PORT || DEFAULT_PORT

    squidletUi = new SquidletAppApiConnection(wsHost, wsPort, WsClass)

    //await squidletUi?.start()
  }
})()

const testData = {
  // allBlogs: {
  //   result: [
  //     {
  //       name: 'plibereco',
  //       title: 'Система Личной Свободы RU',
  //       lang: 'ru',
  //     },
  //   ],
  //   pageNum: 1,
  //   perPage: 10,
  //   totalPages: 1,
  // },
  // blog: {
  //   name: 'plibereco',
  //   title: 'Система Личной Свободы RU',
  //   lang: 'ru',
  // },
  // posts: {
  //   result: [
  //     {
  //       meta: {
  //         fileName: 'post_1.md',
  //         title: 'Post 1',
  //         urlName: 'post-1',
  //       },
  //       md: 'post content',
  //     },
  //   ],
  //   pageNum: 1,
  //   perPage: 10,
  //   totalPages: 1,
  // },
}


export const squidletAppApi = {
  async loadAllBlogs(): Promise<ListResponse<BlogMeta>> {
    const result = []
    const resp = await squidletUi?.send({
      method: 'ctx.userData.readDir',
      arguments: [PUBLISHER_ROOT_DIR],
    })

    if (resp.errorStatus) {
      throw error(resp.errorStatus, resp.errorMessage)
    }


    for (const dirName of resp.data) {
      const blogYamlPath = pathJoin(PUBLISHER_ROOT_DIR, dirName, BLOG_YAML)
      const blogResp = await squidletUi?.send({
        method: 'ctx.userData.readTextFile',
        arguments: [blogYamlPath],
      })

      if (blogResp.errorStatus) {
        throw error(blogResp.errorStatus, blogResp.errorMessage)
      }

      let yamlData: any

      try {
        yamlData = yaml.parse(blogResp.data)
      }
      catch (e) {
        throw error(500, `Error parsing yaml of "${blogYamlPath}": ${e}`)
      }

      result.push({
        name: dirName,
        ...yamlData,
      })
    }

    // TODO: add pagination
    return {
      result,
      pageNum: 1,
      perPage: 10,
      totalPages: 1,
    }
  },

  async loadBlogData(blogName: string): Promise<ItemResponse<BlogMeta>> {
    const blogYamlPath = pathJoin(PUBLISHER_ROOT_DIR, blogName, BLOG_YAML)
    const blogResp = await squidletUi?.send({
      method: 'ctx.userData.readTextFile',
      arguments: [blogYamlPath],
    })

    if (blogResp.errorStatus) {
      throw error(blogResp.errorStatus, blogResp.errorMessage)
    }

    let yamlData: any

    try {
      yamlData = yaml.parse(blogResp.data)
    }
    catch (e) {
      throw error(500, `Error parsing yaml of "${blogYamlPath}": ${e}`)
    }

    return {
      result: {
        name: blogName,
        ...yamlData,
      },
    }
  },

  async loadBlogPosts(blogName: string): Promise<ListResponse<PostResult>> {
    const result = []
    const toPublishDirPath = pathJoin(PUBLISHER_ROOT_DIR, blogName, TO_PUBLISH_DIR)
    const resp = await squidletUi?.send({
      method: 'ctx.userData.readDir',
      arguments: [toPublishDirPath],
    })

    if (resp.errorStatus) {
      throw error(resp.errorStatus, resp.errorMessage)
    }
    
    const filtered = resp.data.filter((item: string) => item.match(/\.md$/))
    
    for (const mdFileName of filtered) {
      const mdFilePath = pathJoin(toPublishDirPath, mdFileName)
      const mdFileResp = await squidletUi?.send({
        method: 'ctx.userData.readTextFile',
        arguments: [mdFilePath],
      })

      if (mdFileResp.errorStatus) {
        throw error(mdFileResp.errorStatus, mdFileResp.errorMessage)
      }

      let meta: any
      let md: string

      try {
        [meta, md] = await splitMdAndMeta(mdFileResp.data)
      }
      catch (e) {
        throw error(500, `Error parsing yaml of "${mdFilePath}": ${e}`)
      }

      result.push({
        meta: {
          fileName: mdFileName,
          ...meta,
        },
        md,
      })
    }

    // TODO: add pagination
    return {
      result,
      pageNum: 1,
      perPage: 10,
      totalPages: 1,
    }
    
    //return testData.posts
  },

  async loadBlogPostItem(blogName: string, postFileName: string): Promise<ItemResponse<PostResult>> {
    const mdFilePath = pathJoin(
      PUBLISHER_ROOT_DIR,
      blogName,
      TO_PUBLISH_DIR,
      postFileName
    )
    const mdFileResp = await squidletUi?.send({
      method: 'ctx.userData.readTextFile',
      arguments: [mdFilePath],
    })

    if (mdFileResp.errorStatus) {
      throw error(mdFileResp.errorStatus, mdFileResp.errorMessage)
    }

    let meta: any
    let md: string

    try {
      [meta, md] = await splitMdAndMeta(mdFileResp.data)
    }
    catch (e) {
      throw error(500, `Error parsing yaml of "${mdFilePath}": ${e}`)
    }

    return {
      result: {
        meta: {
          fileName: postFileName,
          ...meta,
        },
        md,
      }
    }

    //return {result: testData.posts.result[0]}
  },
}
