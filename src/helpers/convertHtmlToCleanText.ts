import {fromHtml} from 'hast-util-from-html'
import {toMdast} from 'hast-util-to-mdast'
import {makeCleanText} from './convertCommonMdToCleanText.js';
import {MdastNode} from 'hast-util-to-mdast/lib';


export function convertHtmlToCleanText(htmlStr?: string): string | undefined {
  if (!htmlStr) return

  let preSpaces = ''
  const preSpacesMatch = htmlStr.match(/^(\s*)/)

  if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]

  const tree = fromHtml(htmlStr, {
    fragment: true
  })

  const mdastTree = toMdast(tree, {
    handlers: {
      br: (state, node): void | MdastNode | MdastNode[] => {
        return {
          type: 'text',
          value: '\n',
        }
      }
    }
  })

  return preSpaces + makeCleanText(mdastTree).replace(/\n$/, '')
}


//
// const test = `
//
// text
// <h1>h1</h1>
// <h2>h2</h2>
// <h3>h3</h3>
// <h4>h4</h4>
// <h5>h4</h5>
// <h6>h6</h6>
// <p>
// some paragraph <b>bold </b><i>italic </i><s> strike</s><u> undelined</u> <code>monospace</code>
// </p>
//
// inline elements <b>bold </b><i>italic </i><s> strike</s><u> undelined</u> <code>monospace</code>
// inline <b>bold <i>bold-italic</i><s> bold-strike</s></b>
//
// <p>
// <b>bold <i>bold-italic</i><s> bold-strike</s></b>
// <br />
// <i>italic <s>italic-strike</s><b> italic-bold</b></i>
// </p>
// <br />
// <a href="https://ya.ru">link</a>
//
// <ul>
// <li>item 1</li>
// <li>
//   item 2
//   <ul>
//     <li>item 2.1</li>
//     <li><b>bbb </b>item 2.2</li>
//   </ul>
// </li>
// </ul>
// <ol>
// <li>item 1</li>
// <li>item 2</li>
// </ol>
//
// <hr />
//
// <blockquote>quote some</blockquote>
//
// `
//
// console.log(await convertHtmlToCleanText(test))
//



// export async function convertHtmlToCleanText(htmlStr?: string): Promise<string | undefined> {
//   if (!htmlStr) return
//
//   const vfile = await unified()
//     .use(rehypeParse)
//     //.use(seeIt as any)
//     .use(remarkToText as any)
//     .use(rehypeStringify)
//     .process(htmlStr)
//
//   return String(vfile)
// }

// function makeInlineString(nodes: (Element | Text)[]): string {
//   const result: string[] = []
//
//   for (const node of nodes) {
//     if (node.type === 'element') {
//       result.push(makeInlineString(node.children as (Element | Text)[]))
//     }
//     else if (node.type === 'text') {
//       result.push(node.value)
//     }
//     // else do nothing
//   }
//
//   return result.join('')
// }
//
// function recursiveMakeUl(liElements: (Element)[]): string {
//   const result: string[] = []
//
//   for (const child of liElements) {
//     if ((child as any).type === 'text') {
//       const trimmed = _.trim((child as any).value)
//
//       if (trimmed) result.push(trimmed + '\n')
//     }
//     else if (child.tagName === 'li') {
//       result.push('* ' + recursiveMakeUl(child.children as Element[]))
//     }
//     else if (child.tagName === 'ul') {
//       result.push(
//         '  '
//         + recursiveMakeUl(child.children as Element[])
//           .replace(/\n/g, '\n  ')
//       )
//     }
//     else {
//       result.push(makeInlineString(child.children as Element[]))
//     }
//   }
//
//   return result.join('')
// }
//
// function recursiveMakeOl(liElements: (Element)[]): string {
//   const result: string[] = []
//   let counter = 1
//
//   for (const child of liElements) {
//     if ((child as any).type === 'text') {
//       const trimmed = _.trim((child as any).value)
//
//       if (trimmed) result.push(trimmed + '\n')
//     }
//     else if (child.tagName === 'li') {
//       result.push(`${counter}. ${recursiveMakeUl(child.children as Element[])}`)
//
//       counter++
//     }
//     else {
//       result.push(makeInlineString(child.children as Element[]))
//     }
//   }
//
//   return result.join('')
// }
//
// function makeStringOfNode(node: any): string {
//   // block elements
//   if ([
//     'body',
//     'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//     'p', 'blockquote', 'aside', 'pre', 'abbr', 'address', 'article', 'cite',
//     'details', 'div', 'footer', 'header', 'main', 'section', 'summary', 'nav',
//     'dl', 'dt',
//   ].includes(node.tagName)) {
//     return _.trim(
//       node.children.map((child: any) => makeStringOfNode(child)
//     ).join('')) + '\n\n'
//   }
//   // inline elements
//   else if ([
//     'b', 'strong', 'i', 'em', 's', 'u', 'code', 'mark', 'span', 'q', 'samp',
//     'small', 'sub', 'sup', 'time', 'ins', 'del'
//   ].includes(node.tagName)) {
//     return makeInlineString(node.children)
//   }
//   // text
//   else if (node.type === 'text') {
//     if (node.value.match(/^\n\n\s*$/)) {
//       return '\n'
//     }
//     else if (node.value.match(/^\n\s*$/)) {
//       return ''
//     }
//     else {
//       return node.value
//     }
//   }
//   // media and so on - have to be hidden
//   else if ([
//     'img', 'figure', 'video', 'audio', 'data', 'canvas', 'datalist', 'button',
//     'dialog', 'embed', 'form', 'iframe', 'input', 'kbd', 'label', 'link', 'map',
//     'meter', 'noscript', 'object', 'option', 'output', 'picture', 'progress',
//     'ruby', 'script', 'select', 'svg', 'table', 'template', 'textarea', 'var', 'wbr',
//     'head'
//   ].includes(node.tagName)) {
//     return ''
//   }
//   else if (['ul'].includes(node.tagName)) {
//     return _.trim(recursiveMakeUl(node.children)) + '\n\n'
//   }
//   else if (['ol'].includes(node.tagName)) {
//     return _.trim(recursiveMakeOl(node.children)) + '\n\n'
//   }
//   else if (['br'].includes(node.tagName)) {
//     return '\n'
//   }
//   else if (['hr'].includes(node.tagName)) {
//     return '---\n\n'
//   }
//   else if (['a'].includes(node.tagName)) {
//     return makeInlineString(node.children)
//   }
//
//   return ''
// }
//
//
// function remarkToText() {
//   return (tree: any, file: any) => {
//     visit(tree, (node) => {
//       if ([
//         'html'
//       ].includes(node.tagName)) {
//         node.type = 'text'
//         node.value = _.trim(
//           node.children.map((child: any) => makeStringOfNode(child)).join('')
//         )
//           .replace(/\n\n\n/g, '\n\n')
//           .replace(/\ \ /g, ' ')
//         delete node.tagName
//         delete node.properties
//         delete node.children
//         delete node.position
//       }
//     })
//   }
// }




////////////////////////


// function seeIt() {
//   return (tree: any) => {
//     visit(tree, (node) => {
//
//       console.log(22222, node)
//
//     })
//   }
// }

// function convertNode(node: any) {
//   // block elements
//   if ([
//     'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//     'p', 'blockquote', 'aside', 'pre', 'abbr', 'address', 'article', 'cite',
//     'details', 'div', 'footer', 'header', 'main', 'section', 'summary', 'nav',
//   ].includes(node.tagName)) {
//     node.type = 'text'
//     //node.value = _.trim(makeInlineString(node.children), '\n') + '\n'
//     node.value = node.children.map((child: any) => convertNode(child)).join('')
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   // inline elements
//   else if ([
//     'b', 'strong', 'i', 'em', 's', 'u', 'code', 'mark', 'span', 'q', 'samp',
//     'small', 'sub', 'sup', 'time', 'ins', 'del'
//   ].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = makeInlineString(node.children)
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   // media and so on - have to be hidden
//   else if ([
//     'img', 'video', 'audio', 'data', 'canvas', 'datalist', 'button',
//     'dialog', 'embed', 'form', 'iframe', 'input', 'kbd', 'label', 'link', 'map',
//     'meter', 'noscript', 'object', 'option', 'output', 'picture', 'progress',
//     'ruby', 'script', 'select', 'svg', 'table', 'template', 'textarea', 'var', 'wbr',
//     'head'
//   ].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = ''
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   else if (['ul'].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = recursiveMakeUl(node.children)
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   else if (['ol'].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = recursiveMakeOl(node.children)
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   else if (['br'].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = '\n'
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   else if (['hr'].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = '---\n'
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   else if (['a'].includes(node.tagName)) {
//     node.type = 'text'
//     node.value = makeInlineString(node.children)
//     delete node.tagName
//     delete node.properties
//     delete node.children
//     delete node.position
//   }
//   else if (node.type === 'text') {
//     if (node.value.match(/^\n\n$/)) {
//       //node.value = '\n'
//     }
//     else {
//
//     }
//
//
//     //console.log(2222, node.value)
//   }
//   else {
//     //console.log(3333, node)
//   }
// }
