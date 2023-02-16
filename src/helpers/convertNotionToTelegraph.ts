import {NOTION_BLOCK_TYPES} from '../types/notion.js';
import {TelegraphNode} from '../../_useless/telegraphCli/types.js';
import {NotionBlocks} from '../types/notion.js';
import {richTextToPlainText} from './convertHelpers.js';
import {richTextToTelegraphNodes} from './convertHelpersTelegraPh.js';
import App from '../App.js';


export async function convertNotionToTelegraph(
  app: App,
  blocks: NotionBlocks
): Promise<TelegraphNode[]> {
  const result: TelegraphNode[] = []
  let ulElIndex = -1
  let olElIndex = -1

  for (const block of blocks) {
    let children: TelegraphNode[] = []

    if ((block as any).children) {
      children = await convertNotionToTelegraph(app, (block as any).children)
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      ulElIndex = -1;
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      olElIndex = -1;
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.image:
        const telegraphImgUrl = await app.telegraPh
          .uploadImage((block as any).image.file.url)
        const caption = richTextToTelegraphNodes((block as any).image.caption)

        if (caption.length) {
          result.push({
            tag: 'figure',
            children: [
              {
                tag: 'img',
                attrs: {
                  src: telegraphImgUrl,
                },
              },
              {
                tag: 'figcaption',
                children: caption
              }
            ]
          })
        } else {
          result.push({
            tag: 'img',
            attrs: {
              src: telegraphImgUrl,
              alt: 'alt',
              title: 'title',
            }
          })
        }

        break
      case NOTION_BLOCK_TYPES.heading_1:
        result.push({
          tag: 'h3',
          children: [richTextToPlainText((block as any)?.heading_1?.rich_text)],
        })

        break
      case NOTION_BLOCK_TYPES.heading_2:
        result.push({
          tag: 'h3',
          children: [richTextToPlainText((block as any)?.heading_2?.rich_text)],
        })

        break;
      case NOTION_BLOCK_TYPES.heading_3:
        result.push({
          tag: 'h4',
          children: [richTextToPlainText((block as any)?.heading_3?.rich_text)],
        })

        break;
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result.push({
            tag: 'p',
            children: [
              ...richTextToTelegraphNodes((block as any)?.paragraph?.rich_text),
              ...children,
            ]
          });
        } else {
          // empty row
          result.push({
            tag: 'p',
            children: ['\n'],
          })
        }
        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        const liItem: TelegraphNode = {
          tag: 'li',
          children: [
            ...richTextToTelegraphNodes((block as any)?.bulleted_list_item?.rich_text),
            ...children,
          ],
        };

        if (ulElIndex === -1) {
          // create new UL
          result.push({
            tag: 'ul',
            children: [liItem],
          });

          ulElIndex = result.length - 1;
        } else {
          result[ulElIndex].children?.push(liItem);
        }

        break;
      case NOTION_BLOCK_TYPES.numbered_list_item:
        const liItemNum: TelegraphNode = {
          tag: 'li',
          children: [
            ...richTextToTelegraphNodes((block as any)?.numbered_list_item?.rich_text),
            ...children,
          ],
        };

        if (olElIndex === -1) {
          // create new OL
          result.push({
            tag: 'ol',
            children: [liItemNum],
          });

          olElIndex = result.length - 1;
        } else {
          result[olElIndex].children?.push(liItemNum);
        }

        break;
      case NOTION_BLOCK_TYPES.quote:
        result.push({
          tag: 'blockquote',
          children: [
            ...richTextToTelegraphNodes((block as any)?.quote?.rich_text),
            ...children,
          ],
        })

        break;
      case NOTION_BLOCK_TYPES.code:
        result.push({
          tag: 'pre',
          attrs: {lang: (block as any)?.code?.language},
          children: [
            richTextToPlainText((block as any)?.code?.rich_text),
            ...children,
          ],
        });

        break;
      case NOTION_BLOCK_TYPES.divider:
        result.push({
          tag: 'hr',
        });

        break;
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
  }

  return result
}



//const aa = 'форматированный текст _ наклонный _ * жирный * __ подчёркнутый __ ~ перечёркнутый ~'
//
// (async () => {
//
//   var aa = [
//     {
//       "object": "block",
//       "id": "e0cda824-4a62-4016-9b24-846a72bfbf82",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-07T07:24:00.000Z",
//       "last_edited_time": "2023-02-08T08:19:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": false,
//       "archived": false,
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [],
//         "color": "default"
//       }
//     },
//     {
//       "object": "block",
//       "id": "202b0fc0-3bee-49a3-9fe6-104680adadf6",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-07T07:24:00.000Z",
//       "last_edited_time": "2023-02-16T07:34:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": false,
//       "archived": false,
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [
//           {
//             "type": "text",
//             "text": {
//               "content": "norm ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "norm ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "bold ",
//               "link": null
//             },
//             "annotations": {
//               "bold": true,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "bold ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "italic ",
//               "link": null
//             },
//             "annotations": {
//               "bold": true,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "italic ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "url bold italic",
//               "link": {
//                 "url": "https://ya.ru"
//               }
//             },
//             "annotations": {
//               "bold": true,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "url bold italic",
//             "href": "https://ya.ru"
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " bold ",
//               "link": null
//             },
//             "annotations": {
//               "bold": true,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " bold ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "strike",
//               "link": null
//             },
//             "annotations": {
//               "bold": true,
//               "italic": false,
//               "strikethrough": true,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "strike",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " .",
//               "link": null
//             },
//             "annotations": {
//               "bold": true,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " .",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " - ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " - ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "italic ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "italic ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "url bold italic",
//               "link": {
//                 "url": "https://ya.ru"
//               }
//             },
//             "annotations": {
//               "bold": true,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "url bold italic",
//             "href": "https://ya.ru"
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "strike",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": true,
//               "strikethrough": true,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "strike",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "bold",
//               "link": null
//             },
//             "annotations": {
//               "bold": true,
//               "italic": true,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "bold",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " .",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " .",
//             "href": null
//           }
//         ],
//         "color": "default"
//       }
//     },
//     {
//       "object": "block",
//       "id": "ff129a5e-ac19-44cf-8d7c-4dcdc42caca4",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-16T07:40:00.000Z",
//       "last_edited_time": "2023-02-16T07:40:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": false,
//       "archived": false,
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [
//           {
//             "type": "text",
//             "text": {
//               "content": "norm ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "norm ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "underline",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": true,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "underline",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": " ",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": " ",
//             "href": null
//           },
//           {
//             "type": "text",
//             "text": {
//               "content": "code",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": true,
//               "color": "default"
//             },
//             "plain_text": "code",
//             "href": null
//           }
//         ],
//         "color": "default"
//       }
//     },
//     {
//       "object": "block",
//       "id": "2a026f6f-233d-4a1a-b1c5-ab69f52b3d8c",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-07T07:24:00.000Z",
//       "last_edited_time": "2023-02-08T08:19:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": false,
//       "archived": false,
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [
//           {
//             "type": "text",
//             "text": {
//               "content": "текст",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "текст",
//             "href": null
//           }
//         ],
//         "color": "default"
//       }
//     },
//     {
//       "object": "block",
//       "id": "978c395d-c409-489b-bf5a-f0d4415cdfb0",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-08T06:45:00.000Z",
//       "last_edited_time": "2023-02-08T06:45:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": true,
//       "archived": false,
//       "type": "bulleted_list_item",
//       "bulleted_list_item": {
//         "rich_text": [
//           {
//             "type": "text",
//             "text": {
//               "content": "list item 1",
//               "link": null
//             },
//             "annotations": {
//               "bold": false,
//               "italic": false,
//               "strikethrough": false,
//               "underline": false,
//               "code": false,
//               "color": "default"
//             },
//             "plain_text": "list item 1",
//             "href": null
//           }
//         ],
//         "color": "default"
//       },
//       "children": [
//         {
//           "object": "block",
//           "id": "e1ddc67e-a782-4491-992c-44db3bece770",
//           "parent": {
//             "type": "block_id",
//             "block_id": "978c395d-c409-489b-bf5a-f0d4415cdfb0"
//           },
//           "created_time": "2023-02-08T06:45:00.000Z",
//           "last_edited_time": "2023-02-08T06:45:00.000Z",
//           "created_by": {
//             "object": "user",
//             "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//           },
//           "last_edited_by": {
//             "object": "user",
//             "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//           },
//           "has_children": false,
//           "archived": false,
//           "type": "bulleted_list_item",
//           "bulleted_list_item": {
//             "rich_text": [
//               {
//                 "type": "text",
//                 "text": {
//                   "content": "list item 1.1",
//                   "link": null
//                 },
//                 "annotations": {
//                   "bold": false,
//                   "italic": false,
//                   "strikethrough": false,
//                   "underline": false,
//                   "code": false,
//                   "color": "default"
//                 },
//                 "plain_text": "list item 1.1",
//                 "href": null
//               }
//             ],
//             "color": "default"
//           }
//         }
//       ]
//     },
//     {
//       "object": "block",
//       "id": "d72fafb8-17fd-4ebe-8574-7d4afb95c5dc",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-08T06:45:00.000Z",
//       "last_edited_time": "2023-02-08T08:19:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": false,
//       "archived": false,
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [],
//         "color": "default"
//       }
//     },
//     {
//       "object": "block",
//       "id": "e663cfff-5b31-408d-a2c9-879a5650e82c",
//       "parent": {
//         "type": "page_id",
//         "page_id": "51b6d7d8-59ec-41af-acb4-13258742f791"
//       },
//       "created_time": "2023-02-08T06:45:00.000Z",
//       "last_edited_time": "2023-02-08T08:19:00.000Z",
//       "created_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "last_edited_by": {
//         "object": "user",
//         "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
//       },
//       "has_children": false,
//       "archived": false,
//       "type": "paragraph",
//       "paragraph": {
//         "rich_text": [],
//         "color": "default"
//       }
//     }
//   ]
//
//   console.log(111, JSON.stringify(await convertNotionToTelegraph({} as any, aa as any), null,2))
// })()
