export type TgEntityType = 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'spoiler'
  | 'url'
  | 'text_link'


export interface TgEntity {
  offset: number
  length: number
  type: TgEntityType
  url?: string
}
