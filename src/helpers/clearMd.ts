import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {visit} from 'unist-util-visit'
import {VFile} from 'vfile';


function toTextValue(node: any): string {
  if (node.value) return node.value
  else if (node.children) {
    return node.children.map((item: any) => toTextValue(item)).join('')
  }

  return ''
}

function toTextNode(node: any) {
  node.type = 'text'

  if (node.children) {
    node.value = node.children.map((node: any) => toTextValue(node)).join('')
  }

  delete node.children
  delete node.url
  delete node.title
}

function remarkClearMd() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (['emphasis', 'strong', 'inlineCode', 'link'].includes(node.type)) {
        toTextNode(node)
      }
    })
  }
}


/**
 * Remove formatting of md from text to use it for collecting symbols count.
 * ! It doesn't support of ~strikethrough~
 * example:
 *   from:
 *     norm *bold* _italic_ __underiline__ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm
 *   to:
 *     norm bold italic underiline monospace  https://google.com url norm
 */
export async function clearMd(mdText?: string): Promise<string | undefined> {
  if (!mdText) return

  const file = await unified()
    // read MD to syntax tree
    .use(remarkParse)
    .use(remarkClearMd as any)

    // make string from syntax tree
    .use(remarkStringify)
    .process(new VFile(mdText))
}


clearMd('norm *bold _italic2_* _italic_ __underiline__ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
