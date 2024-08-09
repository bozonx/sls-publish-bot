import {fromMarkdown} from 'mdast-util-from-markdown'
import {convertMdastToCleanText} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/convertMdastToCleanText';


/**
 * Remove formatting of md from text to use it for collecting symbols count.
 * ! It doesn't support of ~strikethrough~
 * example:
 *   from:
 *     norm *bold* _italic_ __underiline__ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm
 *   to:
 *     norm bold italic underiline monospace  https://google.com url norm
 */
export function convertCommonMdToCleanText(mdStr?: string): string | undefined {
  if (!mdStr) return

  let preSpaces = ''
  const preSpacesMatch = mdStr.match(/^(\s*)/)

  if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]

  const tree = fromMarkdown(mdStr)

  return preSpaces + convertMdastToCleanText(tree).replace(/\n$/, '')
}




// const text = `
//
// norm **bold _italic2_** _italic_ <u>underiline</u> <s>strikethrough</s> \`monospace\`
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
// > block quotes 2
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
// const test2 = ' \n\n[СЛС 🏄](https://t.me/+4g8VsoMuldFiMzNi) |\n\n ${ TAGS } #dfdf #dd'
//
// //console.log(111, convertCommonMdToCleanText(text))
// console.log(111, convertCommonMdToCleanText(test2))




// export async function convertCommonMdToCleanText(mdStr?: string): Promise<string | undefined> {
//   if (!mdStr) return
//
//   let preSpaces = ''
//   const preSpacesMatch = mdStr.match(/^(\s*)/)
//
//   if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]
//
//   const vfile = await unified()
//     // read MD to syntax tree
//     .use(remarkParse)
//     .use(remarkClearMd as any)
//     // make string from syntax tree
//     .use(remarkStringify, {
//       listItemIndent: 'one',
//       rule: '-',
//     })
//     .process(new VFile(mdStr))
//
//   return preSpaces + String(vfile)
// }

// function toTextValue(node: any): string {
//   if (node.value) return node.value
//   else if (node.children) {
//     return node.children.map((item: any) => toTextValue(item)).join('')
//   }
//
//   return ''
// }
//
// function toTextNode(node: any) {
//   node.type = 'text'
//
//   if (node.children) {
//     node.value = node.children.map((node: any) => toTextValue(node)).join('')
//   }
//
//   delete node.children
//   delete node.url
//   delete node.title
// }
//
// function toParagraphNode(node: any) {
//   node.type = 'paragraph'
//
//   delete node.depth
// }
//
// function remarkClearMd() {
//   return (tree: any) => {
//     visit(tree, (node) => {
//       if (['emphasis', 'strong', 'inlineCode', 'link'].includes(node.type)) {
//         toTextNode(node)
//       }
//       else if (['heading'].includes(node.type)) {
//         toParagraphNode(node)
//       }
//       else if (node.type === 'image') {
//         node.type = 'text'
//         node.value = ''
//
//         delete node.children
//         delete node.url
//         delete node.title
//         delete node.alt
//       }
//       else if (node.type === 'code') {
//         node.type = 'paragraph'
//
//         node.children = [{
//           type: 'text',
//           // replace <> to ! to not allow to put slash
//           value: node.value.replace(/[<>]/g, '!')
//         }]
//
//         delete node.lang
//         delete node.meta
//         delete node.position
//       }
//     })
//   }
// }

