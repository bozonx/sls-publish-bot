import {unified} from 'unified';
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter'
import yaml from 'yaml';
import {COMMON_TAGS_MARK} from '$lib/constants';


// TODO: the same as in sls-site
export async function splitMdAndMeta(rawMdContent: string): Promise<[Record<string, any>, string]> {
  let yamlMetaStr: string  = ''
  const md = String(await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, ['yaml'])
    .use(function () {
      return function (tree: any) {
        const yamlIndex = tree.children.findIndex((el: any) => el.type === 'yaml')

        if (yamlIndex < 0) return

        yamlMetaStr = tree?.children[yamlIndex]?.value || ''
        // remove node
        tree?.children.splice(yamlIndex, 1)
      }
    })
    .process(rawMdContent))

  const rawMetaData = yaml.parse(yamlMetaStr)

  return [rawMetaData, md]
}

export function makeStrHashTags(tags: string[] = [], common: string[] = []): string {
  const allTags: string[] = []

  for (const item of tags) {
    if (item === COMMON_TAGS_MARK) {
      for (const commonItem of common) {
        allTags.push(commonItem)
      }
    }
    else {
      allTags.push(item)
    }
  }

  return allTags
    .map((el: string) => `#${el}`)
    .join(' ')
}
