import type {Nodes} from 'mdast'
import {toMarkdown} from 'mdast-util-to-markdown'


const TO_MARKDOWN_OPTIONS = {
  emphasis: '_',
  listItemIndent: 'one',
  rule: '-',
} as any


export function convertMdastToCleanText(tree: Nodes): string {
  return toMarkdown(tree, {
    ...TO_MARKDOWN_OPTIONS,
    handlers: {
      heading: (node, parent, state, info): string => {
        return convertMdastToCleanText({
          type: 'root',
          children: node.children
        }).trim()
      },
      code: (node, parent, state, info): string => {
        return node.value
      },
      emphasis: (node, parent, state, info): string => {
        return convertMdastToCleanText({
          type: 'root',
          children: node.children
        }).replace(/\n$/, '')
      },
      strong: (node, parent, state, info): string => {
        return convertMdastToCleanText({
          type: 'root',
          children: node.children
        }).replace(/\n$/, '')
      },
      delete: (node, parent, state, info): string => {
        return convertMdastToCleanText({
          type: 'root',
          children: node.children
        }).replace(/\n$/, '')
      },
      link: (node, parent, state, info): string => {
        return convertMdastToCleanText({
          type: 'root',
          children: node.children
        }).replace(/\n$/, '')
      },
      inlineCode: (node, parent, state, info): string => {
        return node.value
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
