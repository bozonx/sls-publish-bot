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
  POST_INDEX_MD,
  TO_PUBLISH_DIR
} from '$lib/constants';
import type {BlogConfig} from '$lib/types/BlogConfig'
import type {AppConfig} from '$lib/types/AppConfig'
import {APP_CONFIG_DEFAULTS} from '$lib/types/AppConfig'
import {splitMetaMd} from '$lib/convert/splitMetaMd'


// TODO: get from squildlet
const DEFAULT_API_HOST = 'localhost'
// TODO: get _Apps from squildlet
//const PUBLISHER_ROOT_DIR = `/_Apps/${APP_NAME}`
const BLOGS_DIR = 'blogs'


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
    const {data: blogsArr} = await this.squidletUi.app.ctx.appUserData.readDir(BLOGS_DIR)

    for (const dirName of blogsArr) {
      const blogYamlPath = pathJoin(BLOGS_DIR, dirName, BLOG_YAML)
      const {data: yamlStr} = await this.squidletUi.app.ctx.appUserData.readTextFile(blogYamlPath)

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
    const blogYamlPath = pathJoin(BLOGS_DIR, blogName, BLOG_YAML)
    const {data: yamlStr} = await this.squidletUi.app.ctx.appUserData.readTextFile(blogYamlPath)

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
    const toPublishDirPath = pathJoin(BLOGS_DIR, blogName, TO_PUBLISH_DIR)
    const {data: postsDirs} = await this.squidletUi.app.ctx.appUserData.readDir(toPublishDirPath)

    for (const postDir of postsDirs) {
      const mdFilePath = pathJoin(toPublishDirPath, postDir, POST_INDEX_MD)
      const {data: yamlStr} = await this.squidletUi.app.ctx.appUserData.readTextFile(mdFilePath)
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
          //fileName: `${postDir}/${POST_INDEX_MD}`,
          postId: postDir,
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

  async loadBlogPostItem(blogName: string, dir: string, postId: string): Promise<ItemResponse<PostResult>> {
    const mdFilePath = pathJoin(
      BLOGS_DIR,
      blogName,
      dir,
      postId,
      POST_INDEX_MD
    )
    const {data: mdStr} = await this.squidletUi.app.ctx.appUserData.readTextFile(mdFilePath)

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
          postId,
          //fileName: postFileName,
          ...meta,
        },
        md,
      }
    }

    //return {result: testData.posts.result[0]}
  }

  async saveBlogConfig(blogName: string, config: BlogConfig): Promise<void> {
    const blogYamlPath = pathJoin(
      BLOGS_DIR,
      blogName,
      BLOG_YAML,
    )
    const yamlStr = yaml.stringify(config)

    await this.squidletUi.app.ctx.appUserData.writeFile(blogYamlPath, yamlStr)
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
    const blogPath = pathJoin(BLOGS_DIR, blogSafeName)

    await this.squidletUi.app.ctx.appUserData.mkdir(blogPath)
    await this.squidletUi.app.ctx.appUserData.mkdir(pathJoin(blogPath, TO_PUBLISH_DIR))
    await this.squidletUi.app.ctx.appUserData.mkdir(pathJoin(blogPath, ARCHIVE_DIR))
    await this.squidletUi.app.ctx.appUserData.writeFile(
      pathJoin(blogPath, BLOG_YAML),
      `name: ${blogSafeName}\ntitle: ${blogSafeName}\n`
    )
  }

  async createToPublishPost(blogName: string): Promise<string> {
    const id = makeUniqId(PAGE_ID_LENGTH)
    const toPublishPath = pathJoin(BLOGS_DIR, blogName, TO_PUBLISH_DIR, id)
    const content = `---\n---\n`

    await this.squidletUi.app.ctx.appUserData.mkdir(toPublishPath)
    await this.squidletUi.app.ctx.appUserData.writeFile(
      pathJoin(toPublishPath, POST_INDEX_MD),
      content
    )

    return id
  }

  async moveContentPlanPostToArchive(blogSafeName: string, postId: string): Promise<void> {
    const blogPath = pathJoin(BLOGS_DIR, blogSafeName)
    const postDir = pathJoin(blogPath, TO_PUBLISH_DIR, postId)
    const archiveDir = pathJoin(blogPath, ARCHIVE_DIR)

    await this.squidletUi.app.ctx.appUserData.mv([postDir], archiveDir)
  }

  async moveContentPlanPostToContentPlan(blogSafeName: string, postId: string): Promise<void> {
    const blogPath = pathJoin(BLOGS_DIR, blogSafeName)
    const postDir = pathJoin(blogPath, ARCHIVE_DIR, postId)
    const archiveDir = pathJoin(blogPath, TO_PUBLISH_DIR)

    await this.squidletUi.app.ctx.appUserData.mv([postDir], archiveDir)
  }

}

export const squidletAppApi = new SquidletAppApi()
