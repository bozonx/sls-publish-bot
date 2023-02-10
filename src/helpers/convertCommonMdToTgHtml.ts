import {unified} from 'unified';
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import remarkBreaks from 'remark-breaks'
import {visit} from 'unist-util-visit';
import {all} from 'mdast-util-to-hast';


// function seeIt() {
//   return (tree: any) => {
//     visit(tree, (node) => {
//
//       console.log(22222, node)
//
//     })
//   }
// }

// TODO: remove blocks - headers, quotes, lists
// TODO: см makeArticleTgPostHtml - убираются переносы строк

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

  const vfile = await unified()
    .use(remarkParse)
    //.use(remarkBreaks)
    //.use(seeIt as any)
    //// @ts-ignore
    .use(remarkHtml, {
      sanitize: true,
      //passThrough: ['p'],
      handlers: {
        strong(h: any, node: any) {
          return h(node, 'b', all(h, node))
        },
        emphasis(h: any, node: any) {
          return h(node, 'i', all(h, node))
        },
        paragraph(h: any, node: any) {
          //console.log(222, h, node)
          //return 'children' in node ? {...node, children: all(h, node)} : node
          return h(node, '', all(h, node))
          //return h(node, 'span', all(h, node))
        },
      },
    })
    .process(mdStr)
  //console.log(1111, String(vfile))

  return preSpaces + String(vfile)
}


(async () => {
  const text = `

norm *bold _italic2_* _italic_ __underiline__ \`monospace\`
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
  //console.log(111, await convertCommonMdToCleanText(test2))
})()



//convertCommonMdToTgHtml('\n\nnorm *bold _italic2_*\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
//convertCommonMdToTgHtml('\n\nnorm **bold _italic2_**\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
//convertCommonMdToTgHtml('\n\n# h1\n## h2\n### h3\n#### h4\nppp\n\n* li1\n* li2\n\n1. n1\n2. n2\n\n> q1\n> q2\n\n-------\n\n```bash\nls\n```')
