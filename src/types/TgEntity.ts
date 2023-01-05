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
