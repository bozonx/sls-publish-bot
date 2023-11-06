import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/notion';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {richTextToPlainText} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/convertHelpers';


export function richTextToHtml(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return ''
  else if (!richText.length) return ''

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toHtml(item.text.content, item.annotations, item.href)
      default:
        return item.plain_text
    }
  }).join('')
}

export function richTextToHtmlCodeBlock(
  richText: TextRichTextItemResponse[],
  language: string
): string {
  if (!richText.length) return ''

  return htmlFormat.monospaceBlock(richTextToPlainText(richText), language)
}

function toHtml(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): string {
  let preparedText = htmlFormat.escape(text)

  if (link) {
    preparedText = htmlFormat.url(preparedText, link)
  }

  for (const index of Object.keys(annotations)) {
    const decorationName = index as keyof NotionAnnotation

    if (annotations[decorationName] !== true) continue

    if (decorationName === 'bold') {
      // it uses <b>
      preparedText = htmlFormat.bold(preparedText)
    }
    else if (decorationName === 'italic') {
      // it uses <i>
      preparedText = htmlFormat.italic(preparedText)
    }
    else if (decorationName === 'strikethrough') {
      // it uses <s>
      preparedText = htmlFormat.strikethrough(preparedText)
    }
    else if (decorationName === 'underline') {
      // it uses <u>
      preparedText = htmlFormat.underline(preparedText)
    }
    else if (decorationName === 'code') {
      // it uses <code>
      preparedText = htmlFormat.monospace(preparedText)
    }
    // else no formatting
  }

  return preparedText
}
