import {RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';


export function convertHtmlToNotion(htmlText: string): RichTextItemResponse[] {
  return [
    {
      type: 'text',
      text: {
        content: htmlText,
        link: { url: '' },
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default',
      },
      plain_text: htmlText,
      href: null
    }
  ]
}
