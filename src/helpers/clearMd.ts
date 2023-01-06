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

function toParagraphNode(node: any) {
  node.type = 'paragraph'

  delete node.depth
}

function remarkClearMd() {
  return (tree: any) => {
    visit(tree, (node) => {

      //console.log(22222, node)

      if (['emphasis', 'strong', 'inlineCode', 'link'].includes(node.type)) {
        toTextNode(node)
      }
      else if (['heading'].includes(node.type)) {
        toParagraphNode(node)
      }
    })
  }
}


// TODO: remove quote, big code

/**
 * Remove formatting of md from text to use it for collecting symbols count.
 * ! It doesn't support of ~strikethrough~
 * ! It trims before and after line breaks and spaces
 * example:
 *   from:
 *     norm *bold* _italic_ __underiline__ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm
 *   to:
 *     norm bold italic underiline monospace  https://google.com url norm
 */
export async function clearMd(mdText?: string): Promise<string | undefined> {
  if (!mdText) return

  const vfile = await unified()
    // read MD to syntax tree
    .use(remarkParse)
    .use(remarkClearMd as any)
    // make string from syntax tree
    .use(remarkStringify)
    .process(new VFile(mdText))

  //console.log(111, String(vfile))

  return String(vfile)
}

//console.log(111, clearMd('norm *bold _italic2_* _italic_ __underiline__ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm'))
//clearMd(' \n\n[СЛС 🏄](https://t.me/+4g8VsoMuldFiMzNi) | ${ TAGS } #dfdf #dd')
//clearMd('# fff\n> fff\ngggg\nkkk')
