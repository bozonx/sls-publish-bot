import _ from 'lodash';
import {fromMarkdown} from 'mdast-util-from-markdown'


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
    return `<h${node.depth}>`
      + node.children.map((el: any) => convertNodeToString(el)).join('')
      + `</h${node.depth}>\n\n`
  }
  else if (node.type === 'blockquote') {
    // TODO: оно поддерживается вообще ???
    return '> ' + _.trim(
      node.children.map((el: any) => convertNodeToString(el)).join('')
    )
      .replace(/\n$/, '\n> ')
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
      // TODO: экранировать
      + node.value
      + `</code></pre>\n\n`
  }
  else if (node.type === 'thematicBreak') {
    // TODO: оно поддерживается вообще ???
    return '---\n\n'
  }
  else if (node.type === 'emphasis') {
    return `<i>${node.children.map((el: any) => convertNodeToString(el)).join('')}</i>`
  }
  else if (node.type === 'strong') {
    return `<b>${node.children.map((el: any) => convertNodeToString(el)).join('')}</b>`
  }
  else if (node.type === 'link') {
    return `<a href="${node.url}">${node.children.map((el: any) => convertNodeToString(el)).join('')}</a>`
  }
  else if (node.type === 'inlineCode') {
    return `<code>${node.value}</code>`
  }
  else if (node.type === 'text') {
    return node.value
  }
  else if (node.type === 'image') {
    return ''
  }

  return ''
}


/**
 * Converts common MD to Telegram html
 * ! Do not use and blocks like headers, quotes, lists etc
 * ! Use **bold** instead of *bold*
 * ! It doesn't support ~strikethrough~ - <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
 * ! It doesn't support __underiline__ - <u>underline</u>, <ins>underline</ins>
 * ! It trims line breaks and spaces from start and end
 * @param mdStr
 */
export async function convertCommonMdToTgHtml(mdStr?: string): Promise<string | undefined> {
  if (!mdStr) return

  let preSpaces = ''
  const preSpacesMatch = mdStr.match(/^(\s*)/)

  if (preSpacesMatch?.[1]) preSpaces = preSpacesMatch[1]

  // TODO: проверить вложенность i в b
  // TODO: проверить подчеркнутый, перечеркнутый и тд
  // TODO: пропадают \n

  const tree = fromMarkdown(mdStr)

  return convertNodeToString(tree)

  // const vfile = await unified()
  //   .use(remarkParse)
  //   //.use(remarkBreaks)
  //   //.use(seeIt as any)
  //   //// @ts-ignore
  //   // .use(remarkHtml, {
  //   //   sanitize: true,
  //   //   //passThrough: ['ul'],
  //   //   handlers: {
  //   //     strong(h: any, node: any) {
  //   //       return h(node, 'b', all(h, node))
  //   //     },
  //   //     emphasis(h: any, node: any) {
  //   //       return h(node, 'i', all(h, node))
  //   //     },
  //   //     paragraph(h: any, node: any) {
  //   //       //console.log(222, h, node)
  //   //       //return 'children' in node ? {...node, children: all(h, node)} : node
  //   //       return h(node, '', all(h, node))
  //   //       //return h(node, 'span', all(h, node))
  //   //     },
  //   //   },
  //   // } as any)
  //   .use(remarkToHtml as any)
  //   //.use(rehypeStringify)
  //   .use(rehypeStringify)
  //   .process(mdStr)
  // //console.log(1111, String(vfile))
  //
  // return preSpaces + String(vfile)
}

// TODO: bold почему-то сатало i
// TODO: underiline почему-то сатало b
// TODO: пустые строки оставить как есть
// TODO: h1-h6 не преобразовывать
// TODO: blockquote - вроде не поддерживается, тогда сделать типа md
// TODO: вложенные нумерованный списки не сделалис влженными

// TODO: remove blocks - headers, quotes, lists
// TODO: см makeArticleTgPostHtml - убираются переносы строк
// TODO: все не поддерживаемые тэги должны преобразовываться в текст
// TODO: не должно быть p
// TODO: __underiline__ - превращается в b



(async () => {
  const text = `

norm **bold _italic2_** _italic_ __underiline__ \`monospace\`
[https://google.com](https://google.com) [url](https://google.com/) norm
![img](https://google.com)
***bold and italic***

# h1

## h2

### h3

#### h4

##### h5

###### h6

> block quotes
>
> block quotes 2
> ### h3
> *qqq*

1. item1
2. item2
  1. item 2.1
  2. item 2.2

* item 1
* item 2
  * item 2.1
  * item 2.2

\`\`\`html
<script>console.log(111)</script>
\`\`\`

---

`

  const test2 = ' \n\n[СЛС 🏄](https://t.me/+4g8VsoMuldFiMzNi) | ${ TAGS } #dfdf #dd'

  console.log(111, await convertCommonMdToTgHtml(text))
  //console.log(111, await convertCommonMdToTgHtml('sdfsdf'))
  //console.log(111, await convertCommonMdToCleanText(test2))
})()



//convertCommonMdToTgHtml('\n\nnorm *bold _italic2_*\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
//convertCommonMdToTgHtml('\n\nnorm **bold _italic2_**\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
//convertCommonMdToTgHtml('\n\n# h1\n## h2\n### h3\n#### h4\nppp\n\n* li1\n* li2\n\n1. n1\n2. n2\n\n> q1\n> q2\n\n-------\n\n```bash\nls\n```')
