import type {Nodes} from 'mdast'
import {toMarkdown} from 'mdast-util-to-markdown'


export const TO_MARKDOWN_OPTIONS = {
  emphasis: '_',
  listItemIndent: 'one',
  rule: '-',
} as any


export function convertMdastToTgHtml(tree: Nodes): string {
  return toMarkdown(tree, {
    ...TO_MARKDOWN_OPTIONS,
    handlers: {
      heading: (node, parent, state, info): string => {
        return `<b>`
          + convertMdastToTgHtml({
            type: 'root',
            children: node.children
          }).trim()
          + `</b>`
      },
      code: (node, parent, state, info): string => {
        return `<pre><code class="language-${node.lang}">`
          + node.value
            .replace(/([<>])/g, '\\$1')
          + `</code></pre>`
      },
      emphasis: (node, parent, state, info): string => {
        return `<i>`
          + convertMdastToTgHtml({
            type: 'root',
            children: node.children
          }).replace(/\n$/, '')
          + `</i>`
      },
      strong: (node, parent, state, info): string => {
        return `<b>`
          + convertMdastToTgHtml({
            type: 'root',
            children: node.children
          }).replace(/\n$/, '')
          + `</b>`
      },
      delete: (node, parent, state, info): string => {
        return `<s>`
          + convertMdastToTgHtml({
            type: 'root',
            children: node.children
          }).replace(/\n$/, '')
          + `</s>`
      },
      link: (node, parent, state, info): string => {
        return `<a href="${node.url}">`
          + convertMdastToTgHtml({
            type: 'root',
            children: node.children
          }).replace(/\n$/, '')
          + `</a>`
      },
      inlineCode: (node, parent, state, info): string => {
        return `<code>`
          + node.value.replace(/([<>])/g, '\\$1')
          + `</code>`
      },
      image: (node, parent, state, info): string => {
        return ''
      },
      // it is need to not ecranize
      text: (node): string => {
        return node.value
      }
    },
  })
}
