import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import yaml from 'yaml';


// TODO: the same as in sls-site
export async function splitMetaMd(rawMdContent: string): Promise<[Record<string, any>, string]> {
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
