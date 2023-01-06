import {unified} from 'unified';
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import remarkBreaks from 'remark-breaks'
import {visit} from 'unist-util-visit';
import {all} from 'mdast-util-to-hast';


function seeIt() {
  return (tree: any) => {
    visit(tree, (node) => {

      //console.log(22222, node)

    })
  }
}

// TODO: проблема с bold - он хочет чтобы было ** а не одна *
// TODO: проблема с ~strikethrough~
// TODO: проблема с __underiline__
// TODO: проблема что убираются начальные \n\n


export async function tgMdToTgHtml(mdv2?: string): Promise<string | undefined> {
  if (!mdv2) return

  const vfile = await unified()
    .use(remarkParse)
    //.use(remarkBreaks)
    .use(seeIt as any)
    //// @ts-ignore
    .use(remarkHtml, {
      sanitize: true,
      //passThrough: ['p'],
      handlers: {
        strong(h, node) {
          return h(node, 'b', all(h, node))
        },
        // emphasis(h, node) {
        //   return h(node, 'b', all(h, node))
        // },
        paragraph(h, node) {
          //console.log(222, h, node)
          //return 'children' in node ? {...node, children: all(h, node)} : node
          return h(node, '', all(h, node))
          //return h(node, 'span', all(h, node))
        },
      },
    })
    .process(mdv2)
  console.log(1111, String(vfile))

  return String(vfile)
}

//tgMdToTgHtml('\n\nnorm *bold _italic2_*\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
tgMdToTgHtml('\n\nnorm **bold _italic2_**\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm')
//tgMdToTgHtml('\n\n# h1\n## h2\n### h3\n#### h4\nppp\n\n* li1\n* li2\n\n1. n1\n2. n2\n\n> q1\n> q2\n\n-------\n\n```bash\nls\n```')
