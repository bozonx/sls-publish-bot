import {RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';

type RichTextItemRequest = {
  text: {
    content: string;
    link?: {
      url: string;
    } | null;
  };
  type?: "text";
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "gray_background" | "brown_background" | "orange_background" | "yellow_background" | "green_background" | "blue_background" | "purple_background" | "pink_background" | "red_background";
  };
}


export function convertHtmlToNotion(htmlText: string): RichTextItemRequest[] {
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
      },
    }
  ]
}
