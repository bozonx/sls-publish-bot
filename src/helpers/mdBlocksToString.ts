import {MdBlock} from 'notion-to-md/build/types';
import _ from 'lodash';


export function mdBlocksToPrettyMd(mdBlocks: MdBlock[]): string {
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
    else if (item.type === 'divider') {
      result += '---\n\n';
    }
    else if (['quote', 'code', 'numbered_list_item', 'bulleted_list_item'].includes(item.type || '')) {
      result += item.parent + '\n';
    }
    else if (['heading_1', 'heading_2', 'heading_3', 'heading_4'].includes(item.type || '')) {
      // TODO: remove formating
      //result += '\n' + item.parent.replace(/#/g, '\\#') + '\n\n';
      result += '\n' + item.parent + '\n\n';
    }
  }

  return _.trim(result);
}

export function mdBlocksToTelegram(mdBlocks: MdBlock[]): string {
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
    else if (item.type === 'divider') {
      result += '---\n\n';
    }
    else if (['quote', 'code', 'numbered_list_item', 'bulleted_list_item'].includes(item.type || '')) {
      result += item.parent + '\n';
    }
    else if (['heading_1', 'heading_2', 'heading_3', 'heading_4'].includes(item.type || '')) {
      // TODO: remove formating

      const onlyText = _.trim(item.parent.replace(/^#+/, ''))

      result += '\n*' + onlyText + '*\n\n';
    }
  }

  return _.trim(result);

  //return prettyMd.replace(/([\-#<>.])/g, '\\$1');
}

/**
 * Clean text without
 * * links
 * * formatting
 * * more than one line breake
 */
export function mdToCleanText(mdBlocks: MdBlock[]): string {

  // TODO: make clean text

  return mdBlocksToPrettyMd(mdBlocks);
}

function normalizeMarkdown(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '*$1*')
    .replace(/~~([^~]+)~~/g, '~$1~')
    .replace(/<u>([^<]+)<\/u>/g, '__$1__');
}
