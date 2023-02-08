import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints.js';


export type NotionBlocks = BlockObjectResponse[]

export type NotionAnnotation = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "gray_background" | "brown_background" | "orange_background" | "yellow_background" | "green_background" | "blue_background" | "purple_background" | "pink_background" | "red_background"
};

export const NOTION_BLOCK_TYPES = {
  heading_1: 'heading_1',
  heading_2: 'heading_2',
  heading_3: 'heading_3',
  paragraph: 'paragraph',
  bulleted_list_item: 'bulleted_list_item',
  numbered_list_item: 'numbered_list_item',
  quote: 'quote',
  code: 'code',
  divider: 'divider',
  image: 'image',
};

export const NOTION_RICH_TEXT_TYPES = {
  text: 'text',
}
