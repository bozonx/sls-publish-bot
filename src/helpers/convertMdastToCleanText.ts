import {Node} from 'mdast-util-to-markdown/lib';
import {toMarkdown} from 'mdast-util-to-markdown';
import _ from 'lodash';


const TO_MARKDOWN_OPTIONS = {
  emphasis: '_',
  listItemIndent: 'one',
  rule: '-',
} as any


export function convertMdastToCleanText(tree: Node): string {
  return toMarkdown(tree, {
    ...TO_MARKDOWN_OPTIONS,
    handlers: {
      heading: (node, parent, state, info): string => {
        return _.trim(convertMdastToCleanText({
          type: 'root',
          children: node.children
        }))
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
