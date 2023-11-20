import type {ResponseMessage} from 'squidlet'

// TODO: может это уже не нужно ???
import {SquidletAppApiConnection, APP_API_WS_PORT} from 'squidlet/SquidletAppApiConnection.js'
import {makeUniqId, pathJoin} from 'squidlet-lib'
import {error} from '@sveltejs/kit'
import yaml from 'yaml'
import type {BlogMeta} from '$lib/types/BlogMeta'
import type {ListResponse} from '$lib/types/ListResponse'
import type {PostResult} from '$lib/types/PostResult'
import type {ItemResponse} from '$lib/types/ItemResponse'
import {browser} from '$app/environment'
import {
  APP_CONFIG_YAML,
  APP_NAME,
  ARCHIVE_DIR,
  BLOG_YAML,
  PAGE_ID_LENGTH,
  POST_INDEX_YAML,
  TO_PUBLISH_DIR
} from '$lib/constants';
import type {BlogConfig} from '$lib/types/BlogConfig'
import type {AppConfig} from '$lib/types/AppConfig'
import {APP_CONFIG_DEFAULTS} from '$lib/types/AppConfig'
import {splitMetaMd} from '$lib/convert/splitMetaMd'


// TODO: get from squildlet
const DEFAULT_API_HOST = 'localhost'
// TODO: get _Apps from squildlet
const PUBLISHER_ROOT_DIR = `/_Apps/${APP_NAME}`


class SquidletAppApi {
  squidletUi!: SquidletAppApiConnection
  
  
  constructor() {
    this.squidletUi = browser && new SquidletAppApiConnection(
      APP_NAME,
      DEFAULT_API_HOST,
      // TODO: брать из env
      APP_API_WS_PORT,
      WebSocket,
      false,
      (resp: ResponseMessage) => {
        if (resp.errorStatus) {
          throw error(resp.errorStatus, resp.errorMessage)
        }
      }
    )
  }
  
  async loadAllBlogs(): Promise<ListResponse<BlogMeta>> {
    const result = []
    const {data: blogsArr} = await this.squidletUi.app.ctx.home.readDir(PUBLISHER_ROOT_DIR)

    for (const dirName of blogsArr) {
      const blogYamlPath = pathJoin(PUBLISHER_ROOT_DIR, dirName, BLOG_YAML)
      const {data: yamlStr} = await this.squidletUi.app.ctx.home.readTextFile(blogYamlPath)

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
  }

  async loadBlogData(blogName: string): Promise<ItemResponse<BlogMeta>> {
    const blogYamlPath = pathJoin(PUBLISHER_ROOT_DIR, blogName, BLOG_YAML)
    const {data: yamlStr} = await this.squidletUi.app.ctx.home.readTextFile(blogYamlPath)

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
  }

  async loadBlogPosts(blogName: string): Promise<ListResponse<PostResult>> {
    const result = []
    const toPublishDirPath = pathJoin(PUBLISHER_ROOT_DIR, blogName, TO_PUBLISH_DIR)
    const {data: blogsArr} = await this.squidletUi.app.ctx.home.readDir(toPublishDirPath)
    const filtered = blogsArr.filter((item: string) => item.match(/\.md$/))
    
    for (const mdFileName of filtered) {
      const mdFilePath = pathJoin(toPublishDirPath, mdFileName)
      const {data: yamlStr} = await this.squidletUi.app.ctx.home.readTextFile(mdFilePath)
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
  }

  async loadBlogPostItem(blogName: string, postFileName: string): Promise<ItemResponse<PostResult>> {
    const mdFilePath = pathJoin(
      PUBLISHER_ROOT_DIR,
      blogName,
      TO_PUBLISH_DIR,
      postFileName
    )
    const {data: mdStr} = await this.squidletUi.app.ctx.home.readTextFile(mdFilePath)

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
  }

  async saveBlogConfig(blogName: string, config: BlogConfig): Promise<void> {
    const blogYamlPath = pathJoin(
      PUBLISHER_ROOT_DIR,
      blogName,
      BLOG_YAML,
    )
    const yamlStr = yaml.stringify(config)

    await this.squidletUi.app.ctx.home.writeFile(blogYamlPath, yamlStr)
  }

  /**
   * Load app config. It creates it if it not exists
   */
  async loadAppConfig(): Promise<ItemResponse<AppConfig>> {
    const {data: isExists} = await this.squidletUi.app.ctx.cfgSynced.isExists(APP_CONFIG_YAML)

    if (isExists === false) {
      // TODO: может это в squidlet делать ???
      // make config for Publisher app
      await this.squidletUi.app.ctx.cfgSynced.mkDirP('/')
      await this.squidletUi.app.ctx.cfgSynced.writeFile(
        APP_CONFIG_YAML,
        yaml.stringify(APP_CONFIG_DEFAULTS)
      )

      return {
        result: APP_CONFIG_DEFAULTS,
      }
    }

    const {data: yamlStr} = await this.squidletUi.app.ctx.cfgSynced.readTextFile(APP_CONFIG_YAML)

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
  }

  async saveAppConfig(config: AppConfig): Promise<void> {
    const yamlStr = yaml.stringify(config)

    await this.squidletUi.app.ctx.cfgSynced.writeFile(APP_CONFIG_YAML, yamlStr)
  }

  async createBlog(blogSafeName: string): Promise<void> {
    const blogPath = pathJoin(PUBLISHER_ROOT_DIR, blogSafeName)

    await this.squidletUi.app.ctx.home.mkdir(blogPath)
    await this.squidletUi.app.ctx.home.mkdir(pathJoin(blogPath, TO_PUBLISH_DIR))
    await this.squidletUi.app.ctx.home.mkdir(pathJoin(blogPath, ARCHIVE_DIR))
    await this.squidletUi.app.ctx.cfgSynced.writeFile(
      pathJoin(blogPath, BLOG_YAML),
      `name: ${blogSafeName}\n`
    )
  }

  async createToPublishPost(): Promise<string> {
    const id = makeUniqId(PAGE_ID_LENGTH)
    const toPublishPath = pathJoin(PUBLISHER_ROOT_DIR, TO_PUBLISH_DIR, id)
    const content = `---\n---\n`

    await this.squidletUi.app.ctx.home.mkdir(toPublishPath)
    await this.squidletUi.app.ctx.cfgSynced.writeFile(
      pathJoin(toPublishPath, POST_INDEX_YAML),
      content
    )

    return id
  }

}

export const squidletAppApi = new SquidletAppApi()
