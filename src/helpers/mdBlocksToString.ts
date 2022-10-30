import {MdBlock} from 'notion-to-md/build/types';
import _ from 'lodash';
//import {unified} from 'unified';
//const unified = import('unified');


const aa = [
  { type: 'paragraph', parent: 'абзац1', children: [] },
  {
    type: 'paragraph',
    parent: 'строка1. _ ~ gh - (gggg) [bbbb]\nстрока2',
    children: []
  },
  { type: 'paragraph', parent: '', children: [] },
  {
    type: 'paragraph',
    parent: 'абзац с большим оступом',
    children: []
  },
  { type: 'bulleted_list_item', parent: '- эл1', children: [] },
  { type: 'bulleted_list_item', parent: '- вложенный', children: [] },
  { type: 'bulleted_list_item', parent: '- эл2', children: [] },
  { type: 'heading_2', parent: '## заголовок 2у', children: [] },
  {
    type: 'numbered_list_item',
    parent: '1. нумерованный',
    children: []
  },
  { type: 'numbered_list_item', parent: '2. список', children: [] },
  { type: 'heading_3', parent: '### Заголовок 3у', children: [] },
  {
    type: 'paragraph',
    parent: 'форматированный текст _наклонный_ **жирный** <u>подчёркнутый</u> ~~перечёркнутый~~ `код`',
    children: []
  },
  {
    type: 'paragraph',
    parent: '[ссылка](/2465ac4b72d54032927d5664bb2ee592)',
    children: []
  },
  { type: 'quote', parent: '> цитата  \n> стр2', children: [] },
  { type: 'paragraph', parent: 'ввв', children: [] },
  {
    type: 'code',
    parent: '```javascript\nбольшой код\n```',
    children: []
  },
  { type: 'paragraph', parent: 'маленькая палка', children: [] },
  { type: 'paragraph', parent: '—', children: [] },
  { type: 'paragraph', parent: 'большая палка', children: [] },
  { type: 'divider', parent: '---', children: [] },
  { type: 'paragraph', parent: 'пррр', children: [] }
];

(async function main() {
  //console.log(3333 , unified)
  //const file = await unified()
    //.use(remarkParse)
    //.process('# Hi\n\n*Hello*, world!')

  //console.log(String(file))
})();

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

      // TODO: обработать children

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
        result += fixTgFormatting(item.parent) + '\n\n';
      }
    }
    else if (item.type === 'divider') {
      result += '---\n\n';
    }
    else if (['code', 'numbered_list_item', 'bulleted_list_item'].includes(item.type || '')) {

      // TODO: fix formatting for lists

      result += item.parent + '\n';
    }
    else if (item.type === 'quote') {

      // TODO: fix formatting

      result += item.parent.replace(/>/g, '|') + '\n';
    }
    else if (['heading_1', 'heading_2', 'heading_3', 'heading_4'].includes(item.type || '')) {
      // TODO: remove formating

      const onlyText = _.trim(item.parent.replace(/^#+/, ''))

      result += '\n*' + onlyText + '*\n\n';
    }
  }

  return _.trim(
    // Do not trim (`) because it doesn't useful
    result
      .replace(/([\-#>.!+=|{}])/g, '\\$1')
      .replace(/([\[\]\(\)])/g, '\\$1')

    // Inside pre and code entities, all '`' and '\' characters must be escaped with a preceding '\' character.
    // Inside (...) part of inline link definition, all ')' and '\' must be escaped with a preceding '\' character.
    // Any character with code between 1 and 126 inclusively can be escaped anywhere with a preceding '\' character,
  );

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

function fixTgFormatting(raw: string): string {
  let line = replaceLonelySpecialSymbol(raw, '_', '_');
  line = normalizeMarkdown(line)
  line = replaceLonelySpecialSymbol(line, '~', '~');
  //line = replaceLonelySpecialSymbol(line, '[', ']');
  // line = replaceLonelySpecialSymbol(line, '(', ')');

  return line;
}

function replaceLonelySpecialSymbol(
  raw: string,
  specialSymbolOpen: string,
  specialSymbolClose: string,
): string {
  const regex = new RegExp(`\\${specialSymbolOpen}([^\\${specialSymbolOpen}\\${specialSymbolClose}]+)\\${specialSymbolClose}`, 'g');
  let replacedPairs = raw.replace(regex, '╗$1╝');
  // let replacedPairs = raw.replace(regex, (substring, index: number): string => {
  //   return '╗' + substring.slice(1, substring.length - 1) + '╝';
  // });

  //console.log(3333, replacedPairs)

  const replFinalRegex = new RegExp(`([\\${specialSymbolOpen}\\${specialSymbolClose}])`, 'g')

  replacedPairs = replacedPairs.replace(replFinalRegex, '\\$1');
  replacedPairs = replacedPairs.replace(/╗/g, specialSymbolOpen);
  replacedPairs = replacedPairs.replace(/╝/g, specialSymbolClose);

  return replacedPairs;
}
