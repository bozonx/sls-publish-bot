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
      if (['emphasis', 'strong', 'inlineCode', 'link'].includes(node.type)) {
        toTextNode(node)
      }
      else if (['heading'].includes(node.type)) {
        toParagraphNode(node)
      }
      else if (node.type === 'image') {
        node.type = 'text'
        node.value = ''

        delete node.children
        delete node.url
        delete node.title
        delete node.alt
      }
      else if (node.type === 'code') {
        node.type = 'paragraph'

        node.children = [{
          type: 'text',
          // replace <> to ! to not allow to put slash
          value: node.value.replace(/[<>]/g, '!')
        }]

        delete node.lang
        delete node.meta
        delete node.position
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
export async function convertCommonMdToCleanText(mdText?: string): Promise<string | undefined> {
  if (!mdText) return

  let preSpaces = ''
  const preSpacesMatch = mdText.match(/^(\s*)/)

  if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]

  const vfile = await unified()
    // read MD to syntax tree
    .use(remarkParse)
    .use(remarkClearMd as any)
    // make string from syntax tree
    .use(remarkStringify, {
      listItemIndent: 'one',
      rule: '-',
    })
    .process(new VFile(mdText))

  return preSpaces + String(vfile)
}

// (async () => {
//   const text = `
//
// norm *bold _italic2_* _italic_ __underiline__ \`monospace\`
// [https://google.com](https://google.com) [url](https://google.com/) norm
// ![img](https://google.com)
// ***bold and italic***
//
// # h1
//
// ## h2
//
// ### h3
//
// #### h4
//
// ##### h5
//
// ###### h6
//
// > block quotes
// >
// > block quotes 2
// > ### h3
// > *qqq*
//
// 1. item1
// 2. item2
//   1. item 2.1
//   2. item 2.2
//
// * item 1
// * item 2
//   * item 2.1
//   * item 2.2
//
// \`\`\`html
// <script>console.log(111)</script>
// \`\`\`
//
// ---
//
// `
//
//   const test2 = ' \n\n[СЛС 🏄](https://t.me/+4g8VsoMuldFiMzNi) | ${ TAGS } #dfdf #dd'
//
//   console.log(111, await convertCommonMdToCleanText(text))
//   //console.log(111, await convertCommonMdToCleanText(test2))
//
// //convertCommonMdToCleanText('# fff\n> fff\ngggg\nkkk')
// })()
//
