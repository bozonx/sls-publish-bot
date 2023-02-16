import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NotionBlocks} from '../types/notion.js';


/**
 * Make plain text string without formatting from Rich text items
 */
export function richTextToPlainText(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return ''
  else if (!richText.length) return ''

  return richText.map((item) => item.plain_text).join('')
}

export function trimPageBlocks(notionBlocks: NotionBlocks): NotionBlocks {
  const result: NotionBlocks = [...notionBlocks]
  // remove the first empty lines
  for (let i = 0; i < notionBlocks.length; i++) {
    if ((notionBlocks[i] as any)?.paragraph?.rich_text?.length === 0) {
      result.shift()
    }
    else {
      break
    }
  }
  // remove the last empty lines
  for (let i = notionBlocks.length - 1; i >= 0; i--) {
    if ((notionBlocks[i] as any)?.paragraph?.rich_text?.length === 0) {
      result.pop()
    }
    else {
      break
    }
  }

  return result
}

/**
 * It makes string like this - ![alt text](image.jpg)
 */
export function makeMdImageString(src: string, altText: string = ''): string {
  return `![${altText}](${src})`
}
