import type {ResponseMessage} from 'squidlet'
import {SquidletAppApiConnection, APP_API_WS_PORT} from 'squidlet/SquidletAppApiConnection.js'
import {pathJoin} from 'squidlet-lib'
import {error} from '@sveltejs/kit'
import yaml from 'yaml'
import type {BlogMeta} from '$lib/types/BlogMeta'
import type {ListResponse} from '$lib/types/ListResponse'
import type {PostResult} from '$lib/types/PostResult'
import type {ItemResponse} from '$lib/types/ItemResponse'
import {browser} from '$app/environment'
import {APP_CONFIG_YAML, APP_NAME, BLOG_YAML, TO_PUBLISH_DIR} from '$lib/constants';
import type {BlogConfig} from '$lib/types/BlogConfig'
import type {AppConfig} from '$lib/types/AppConfig'
import {APP_CONFIG_DEFAULTS} from '$lib/types/AppConfig'
import {splitMetaMd} from '$lib/convert/splitMetaMd'


const PUBLISHER_ROOT_DIR = `/_Apps/${APP_NAME}`

// TODO: get from squildlet
const DEFAULT_API_HOST = 'localhost'
const DEFAULT_PORT = APP_API_WS_PORT
let squidletUi: SquidletAppApiConnection | undefined


// TODO: как-то по тупому
(async () => {
  if (browser) {
    const WsClass: new (url: string, protocol: string) => WebSocket = WebSocket
    // TODO: может лучше из env брать
    // @ts-ignore
    const wsHost = window.SQUIDLET_API_HOST || DEFAULT_API_HOST
    // @ts-ignore
    const wsPort = window.SQUIDLET_API_PORT || DEFAULT_PORT

    squidletUi = new SquidletAppApiConnection(
      APP_NAME,
      wsHost,
      wsPort,
      WsClass,
      false,
      (resp: ResponseMessage) => {
        if (resp.errorStatus) {
          throw error(resp.errorStatus, resp.errorMessage)
        }
      }
    )

    //await squidletUi?.start()
  }
})()


export const squidletAppApi = {
  async loadAllBlogs(): Promise<ListResponse<BlogMeta>> {
    const result = []
    const {data: blogsArr} = await squidletUi.app.ctx.home.readDir(PUBLISHER_ROOT_DIR)

    for (const dirName of blogsArr) {
      const blogYamlPath = pathJoin(PUBLISHER_ROOT_DIR, dirName, BLOG_YAML)
      const {data: yamlStr} = await squidletUi.app.ctx.home.readTextFile(blogYamlPath)

      let yamlData: any

      try {
        yamlData = yaml.parse(yamlStr)
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
    const {data: yamlStr} = await squidletUi.app.ctx.home.readTextFile(blogYamlPath)

    let yamlData: any

    try {
      yamlData = yaml.parse(yamlStr)
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
    const {data: blogsArr} = await squidletUi.app.ctx.home.readDir(toPublishDirPath)
    const filtered = blogsArr.filter((item: string) => item.match(/\.md$/))
    
    for (const mdFileName of filtered) {
      const mdFilePath = pathJoin(toPublishDirPath, mdFileName)
      const {data: yamlStr} = await squidletUi.app.ctx.home.readTextFile(mdFilePath)
      let meta: any
      let md: string

      try {
        [meta, md] = await splitMetaMd(yamlStr)
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
    const {data: mdStr} = await squidletUi.app.ctx.home.readTextFile(mdFilePath)

    let meta: any
    let md: string

    try {
      [meta, md] = await splitMetaMd(mdStr)
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

  async saveBlogConfig(blogName: string, config: BlogConfig): Promise<void> {
    const blogYamlPath = pathJoin(
      PUBLISHER_ROOT_DIR,
      blogName,
      BLOG_YAML,
    )
    const yamlStr = yaml.stringify(config)

    await squidletUi.app.ctx.home.writeFile(blogYamlPath, yamlStr)
  },

  /**
   * Load app config. It creates it if it not exists
   */
  async loadAppConfig(): Promise<ItemResponse<AppConfig>> {
    const {data: isExists} = await squidletUi.app.ctx.cfgSynced.isExists(APP_CONFIG_YAML)

    if (isExists === false) {
      // TODO: может это в squidlet делать ???
      // make config for Publisher app
      await squidletUi.app.ctx.cfgSynced.mkDirP('/')
      await squidletUi.app.ctx.cfgSynced.writeFile(
        APP_CONFIG_YAML,
        yaml.stringify(APP_CONFIG_DEFAULTS)
      )

      return {
        result: APP_CONFIG_DEFAULTS,
      }
    }

    const {data: yamlStr} = await squidletUi.app.ctx.cfgSynced.readTextFile(APP_CONFIG_YAML)

    let yamlData: any

    try {
      yamlData = yaml.parse(yamlStr)
    }
    catch (e) {
      throw error(500, `Error parsing yaml of "${APP_CONFIG_YAML}": ${e}`)
    }

    return {
      result: yamlData,
    }
  },

  async saveAppConfig(config: AppConfig): Promise<void> {
    const yamlStr = yaml.stringify(config)

    await squidletUi.app.ctx.cfgSynced.writeFile(APP_CONFIG_YAML, yamlStr)
  }

}
