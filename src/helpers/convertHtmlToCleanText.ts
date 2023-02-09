import {unified} from 'unified';
import {visit} from 'unist-util-visit';
import rehypeStringify from 'rehype-stringify';
import rehypeParse from 'rehype-parse';
import {Element, Text} from 'hast-util-to-html/lib/types.js';
import _ from 'lodash';


function makeInlineString(nodes: (Element | Text)[]): string {
  const result: string[] = []

  for (const node of nodes) {
    if (node.type === 'element') {
      result.push(makeInlineString(node.children as (Element | Text)[]))
    }
    else if (node.type === 'text') {
      result.push(node.value)
    }
    // else do nothing
  }

  return result.join('')
}

function recursiveMakeUl(liElements: (Element)[]) {
  const result: string[] = []

  for (const child of liElements) {
    if ((child as any).type === 'text') {
      const trimmed = _.trim((child as any).value)

      if (trimmed) result.push(trimmed + '\n')
    }
    else if (child.tagName === 'li') {
      result.push('* ' + recursiveMakeUl(child.children as Element[]))
    }
    else if (child.tagName === 'ul') {
      result.push(
        '  '
        + recursiveMakeUl(child.children as Element[])
          .replace(/\n/g, '\n  ')
      )
    }
    else {
      result.push(makeInlineString(child.children as Element[]))
    }
  }

  return result.join('')
}

function recursiveMakeOl(liElements: (Element)[]) {
  const result: string[] = []
  let counter = 1

  for (const child of liElements) {
    if ((child as any).type === 'text') {
      const trimmed = _.trim((child as any).value)

      if (trimmed) result.push(trimmed + '\n')
    }
    else if (child.tagName === 'li') {
      result.push(`${counter}. ${recursiveMakeUl(child.children as Element[])}`)

      counter++
    }
    else {
      result.push(makeInlineString(child.children as Element[]))
    }
  }

  return result.join('')
}


function remarkToText() {
  return (tree: any, file: any) => {
    visit(tree, 'element', (node) => {
      // block elements
      if ([
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'blockquote', 'aside', 'pre', 'abbr', 'address', 'article', 'cite',
        'details', 'div', 'footer', 'header', 'main', 'section', 'summary', 'nav',
      ].includes(node.tagName)) {
        node.type = 'text'
        node.value = makeInlineString(node.children) + '\n'
        delete node.tagName
        delete node.properties
        delete node.children
      }
      // inline elements
      else if ([
        'b', 'strong', 'i', 'em', 's', 'u', 'code', 'mark', 'span', 'q', 'samp',
        'small', 'sub', 'sup', 'time', 'ins', 'del'
      ].includes(node.tagName)) {
        node.type = 'text'
        node.value = makeInlineString(node.children)
        delete node.tagName
        delete node.properties
        delete node.children
      }
      // media and so on - have to be hidden
      else if ([
        'img', 'video', 'audio', 'data', 'canvas', 'datalist', 'button',
        'dialog', 'embed', 'form', 'iframe', 'input', 'kbd', 'label', 'link', 'map',
        'meter', 'noscript', 'object', 'option', 'output', 'picture', 'progress',
        'ruby', 'script', 'select', 'svg', 'table', 'template', 'textarea', 'var', 'wbr'
      ].includes(node.tagName)) {
        node.type = 'text'
        node.value = ''
        delete node.tagName
        delete node.properties
        delete node.children
      }
      else if (['ul'].includes(node.tagName)) {
        node.type = 'text'
        node.value = recursiveMakeUl(node.children)
        delete node.tagName
        delete node.properties
        delete node.children
      }
      else if (['ol'].includes(node.tagName)) {
        node.type = 'text'
        node.value = recursiveMakeOl(node.children)
        delete node.tagName
        delete node.properties
        delete node.children
      }
      else if (['br'].includes(node.tagName)) {
        node.type = 'text'
        node.value = '\n'
        delete node.tagName
        delete node.properties
        delete node.children
      }
      else if (['hr'].includes(node.tagName)) {
        node.type = 'text'
        node.value = '---\n'
        delete node.tagName
        delete node.properties
        delete node.children
      }
      else if (['a'].includes(node.tagName)) {
        node.type = 'text'
        node.value = makeInlineString(node.children)
        delete node.tagName
        delete node.properties
        delete node.children
      }
    })
  }
}

function seeIt() {
  return (tree: any) => {
    visit(tree, (node) => {

      console.log(22222, node)

    })
  }
}



export async function convertHtmlToCleanText(htmlStr?: string): Promise<string | undefined> {
  if (!htmlStr) return

  // TODO: li, ol, ul, dl, dt, figure, figcaption


  const vfile = await unified()
    .use(rehypeParse)
    //.use(seeIt as any)
    .use(remarkToText as any)
    .use(rehypeStringify)
    .process(htmlStr)


  // TODO: можно удалить проблелы более одного подряд

  return String(vfile)
}




(async () => {
  const test = `text
<h1>h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<h4>h4</h4>
<h5>h4</h5>
<h6>h6</h6>
<p>
some paragraph <b>bold</b><i>italic </i><s> strike</s><u> undelined</u> <code>monospace</code>
</p>

inline elements <b>bold</b><i>italic </i><s> strike</s><u> undelined</u> <code>monospace</code>
inline <b>bold <i>bold-italic</i><s> bold-strike</s></b>

<p>
<b>bold <i>bold-italic</i><s> bold-strike</s></b>
<br />
<i>italic <s>italic-strike</s><b> italic-bold</b></i>
</p>
<br />
<a href="https://ya.ru">link</a>

<ul>
<li>item 1</li>
<li>
  item 2
  <ul>
    <li>item 2.1</li>
    <li><b>bbb </b>item 2.2</li>
  </ul>
</li>
</ul>

<ol>
<li>item 1</li>
<li>item 2</li>
</ol>

<hr />

<blockquote>quote some</blockquote>

`

  console.log(await convertHtmlToCleanText(test))
})()
