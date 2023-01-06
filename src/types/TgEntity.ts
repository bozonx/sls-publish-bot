
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

export interface NormalizedTgItem {
  text: string
  type: SupportedTgEntityType
  url?: string
}


export type TgEntityType = 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'spoiler'
  // just url as text
  | 'url'
  // text with url
  | 'text_link'

export interface TgEntity {
  offset: number
  length: number
  type: TgEntityType
  url?: string
}
