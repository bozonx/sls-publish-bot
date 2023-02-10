import _ from 'lodash';
import {fromMarkdown} from 'mdast-util-from-markdown'


/**
 * Converts common MD to Telegram html
 * ! Use **bold** instead of *bold*
 * ! It doesn't support ~strikethrough~ - use <s>strikethrough</s>, <del>strikethrough</del>
 * ! It doesn't support __underiline__ - use <u>underline</u>, <ins>underline</ins>
 */
export function convertCommonMdToTgHtml(mdStr?: string): string | undefined {
  if (!mdStr) return

  let preSpaces = ''
  const preSpacesMatch = mdStr.match(/^(\s*)/)

  if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]

  const tree = fromMarkdown(mdStr, {
    // extensions: [gfm()],
    // mdastExtensions: [gfmFromMarkdown()],
  } as any)

  return preSpaces + convertNodeToString(tree)
}


function makeOlList(ulNode: any): string {
  return ulNode.children.map((el: any, index: number) => {
    return `${index + 1}. ` + el.children.map((child: any) => {
      if (child.type === 'list') {
        return '  ' + makeOlList(child)
          .replace(/\n/, '\n  ')
      }
      else {
        return convertNodeToString(child)
      }
    }).join('')
  }).join('')
}

function makeUlList(ulNode: any): string {
  return ulNode.children.map((el: any) => {
    return '* ' + el.children.map((child: any) => {
      if (child.type === 'list') {
        return '  ' + makeUlList(child)
          .replace(/\n/, '\n  ')
      }
      else {
        return convertNodeToString(child)
      }
    }).join('')
  }).join('')
}

function convertNodeToString(node: any): string {
  if (node.type === 'root') {
    return node.children.map((el: any) => convertNodeToString(el)).join('')
  }
  else if (node.type === 'paragraph') {
    return node.children.map((el: any) => convertNodeToString(el)).join('') + '\n'
  }
  else if (node.type === 'heading') {
    return `<b>`
      + node.children.map((el: any) => convertNodeToString(el)).join('')
      + `</b>\n\n`
  }
  else if (node.type === 'blockquote') {
    return '| ' + _.trim(
        node.children.map((el: any) => convertNodeToString(el)).join('')
      )
        .replace(/\n/g, '\n| ')
      + '\n\n'
  }
  else if (node.type === 'list') {
    if (node.ordered) {
      return makeOlList(node) + '\n'
    }
    else {
      return makeUlList(node) + '\n'
    }
  }
  else if (node.type === 'code') {
    return `<pre><code class="language-${node.lang}">`
      + node.value
        .replace(/([<>])/g, '\\$1')
      + `</code></pre>\n\n`
  }
  else if (node.type === 'thematicBreak') {
    return '---\n\n'
  }
  else if (node.type === 'emphasis') {
    return `<i>${node.children.map((el: any) => convertNodeToString(el)).join('')}</i>`
  }
  else if (node.type === 'strong') {
    return `<b>${node.children.map((el: any) => convertNodeToString(el)).join('')}</b>`
  }
  else if (node.type === 'delete') {
    return `<s>${node.children.map((el: any) => convertNodeToString(el)).join('')}</s>`
  }
  else if (node.type === 'link') {
    return `<a href="${node.url}">${node.children.map((el: any) => convertNodeToString(el)).join('')}</a>`
  }
  else if (node.type === 'inlineCode') {
    return `<code>${node.value}</code>`
  }
  else if (node.type === 'image') {
    return ''
  }
  // text and other if exist
  else if (node.value) {
    //console.log(3333, node)
    return node.value
  }
  // others if exist
  else if (node.children) {
    return node.children.map((el: any) => convertNodeToString(el)).join('')
  }
  // else
  return ''
}



// (async () => {
//   const text = `
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
//   const test2 = ' \n\n[СЛС 🏄](https://t.me/+4g8VsoMuldFiMzNi) | ${ TAGS } #dfdf #dd'
//
//   console.log(111, convertCommonMdToTgHtml(text))
//   //console.log(111, convertCommonMdToTgHtml(test2))
// })()
