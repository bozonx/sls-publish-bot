import {MdBlock} from 'notion-to-md/build/types';
import _ from 'lodash';


export function mdBlocksToString(mdBlocks: MdBlock[]): string {
  let result = '';

  for (const item of mdBlocks) {
    if (item.children.length) {
      console.warn('md block has children')
    }

    if (item.type === 'paragraph') {
      if (item.parent === '') {
        result += '\n';
      }
      else {
        result += normalizeMarkdown(item.parent) + '\n\n';
      }
    }
    else if (item.type === 'bulleted_list_item') {
      result += ' \\' + item.parent + '\n';
    }
    else if (item.type === 'numbered_list_item') {
      result += ' ' + item.parent + '\n';
    }
    else if (item.type === 'quote') {
      result += item.parent.replace(/>/g, '\\>') + '\n';
    }
    else if (item.type === 'code') {
      result += item.parent + '\n';
    }
    else if (item.type === 'divider') {
      result += '---\n\n';
    }
    else if (['heading_1', 'heading_2', 'heading_3', 'heading_4'].includes(item.type || '')) {
      result += '\n' + item.parent.replace(/#/g, '\\#') + '\n\n';
    }
  }

  // TODO: убрать лишние переносы строк
  return _.trim(result);
}

function normalizeMarkdown(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '*$1*')
    .replace(/~~([^~]+)~~/g, '~$1~')
    .replace(/<u>([^<]+)<\/u>/g, '__$1__');
}