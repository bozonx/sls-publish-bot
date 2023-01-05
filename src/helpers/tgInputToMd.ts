import {markdownv2 as mdFormat} from 'telegram-format';
import {TgEntity} from '../types/TgEntity.js'


export type SupportedTgEntityType = 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'url'
  | 'text'

export const SUPPORTED_TG_ENTITY_TYPES: Record<SupportedTgEntityType, SupportedTgEntityType> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strikethrough: 'strikethrough',
  code: 'code',
  url: 'url',
  text: 'text',
}

interface NormalizedTgItem {
  text: string
  type: SupportedTgEntityType
  url?: string
}


export function tgInputToMd(rawText: string, entities?: TgEntity[]): string {
  const normalized = normalizeTg(rawText, entities)

  return normalized.map((item) => makeMd(item)).join('')
}


function normalizeTg(rawText: string, entities?: TgEntity[]): NormalizedTgItem[] {
  if (!entities || !entities.length) return [{text: rawText, type: 'text'}]

  console.log(1111, rawText, entities)

  const result: NormalizedTgItem[] = []
  // set the first text part
  if (entities[0].offset !== 0) {
    result.push({
      // TODO: check
      text: rawText.slice(0, entities[0].offset - 1),
      type: 'text',
    })
  }

  for (const i in entities) {
    result.push({
      // TODO: check
      text: rawText.slice(entities[i].offset, entities[i].length),
      type: 'text',
    })

    // TODO: add simple text after it
  }

  // TODO: add the last line
  // if () {
  //
  // }

  return result
}

function makeMd(item: NormalizedTgItem): string {
  switch (item.type) {
    case SUPPORTED_TG_ENTITY_TYPES.bold:
      return mdFormat.bold(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.italic:
      return mdFormat.italic(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.underline:
      return mdFormat.underline(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.strikethrough:
      return mdFormat.strikethrough(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.code:
      return mdFormat.monospace(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.url:
      if (item.url) {
        return mdFormat.url(item.text, item.url)
      }
      else {
        return mdFormat.url(item.text, item.text)
      }
    case SUPPORTED_TG_ENTITY_TYPES.text:
      return item.text
    default:
      return ''
  }
}
