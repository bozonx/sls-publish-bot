import _ from 'lodash';
import {NOTION_BLOCK_TYPES} from '../types/notion.js';
import {NotionBlocks} from '../types/notion.js';
import {richTextToPlainText} from './convertHelpers.js';
import {richTextToHtml, richTextToHtmlCodeBlock} from './convertHelpersHtml.js';
import {richTextToTelegraphNodes} from './convertHelpersTelegraPh.js';


// TODO: наверное сначало конвертировать в hast дерево

export function convertNotionToGenericHtml(blocks: NotionBlocks): string {
  const result: string[] = []
  let ulElIndex = -1
  let olElIndex = -1

  for (const block of blocks) {
    let children: string = ''
    // TODO: что делать с картинкой ???
    // skip images
    if (block.type === NOTION_BLOCK_TYPES.image) continue;

    if ((block as any).children) {
      children = convertNotionToGenericHtml((block as any).children)
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      ulElIndex = -1;
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      olElIndex = -1;
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result.push(
          '<h1>'
          + richTextToPlainText((block as any)?.heading_1?.rich_text)
          + '</h1>'
        )

        break
      case NOTION_BLOCK_TYPES.heading_2:
        result.push(
          '<h2>'
          + richTextToPlainText((block as any)?.heading_2?.rich_text)
          + '</h2>'
        )

        break
      case NOTION_BLOCK_TYPES.heading_3:
        result.push(
          '<h3>'
          + richTextToPlainText((block as any)?.heading_3?.rich_text)
          + '</h3>'
        )

        break
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result.push(
            '<p>'
            + richTextToHtml((block as any)?.paragraph?.rich_text)
            + children
            + '</p>'
          )
        }
        else {
          // empty row
          result.push('<p>\n</p>')
        }

        break
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        const liItem = '<li>'
          + richTextToTelegraphNodes((block as any)?.bulleted_list_item?.rich_text)
          + children
          + '</li>'

        if (ulElIndex === -1) {
          // create new UL
          result.push(`<ul>${liItem}</ul>`)

          ulElIndex = result.length - 1
        } else {
          // TODO: нужно добавить li элемент
          //result[ulElIndex].children?.push(liItem);
        }

        break
      case NOTION_BLOCK_TYPES.numbered_list_item:
        const liItemNum = '<li>'
          + richTextToTelegraphNodes((block as any)?.numbered_list_item?.rich_text)
          + children
          + '</li>'

        if (olElIndex === -1) {
          // create new OL
          result.push(`<ol>${liItemNum}</ol>`)

          olElIndex = result.length - 1
        } else {
          // TODO: нужно добавить li элемент
          //result[olElIndex].children?.push(liItemNum)
        }

        break;
      case NOTION_BLOCK_TYPES.quote:
        result.push(
          `<blockquote>`
          // TODO: проверит переносы строк
          + richTextToHtml((block as any)?.quote?.rich_text)
            //.replace(/\n/g, '\n\\| ')
          + '</blockquote>'
        )

        break
      case NOTION_BLOCK_TYPES.code:
        result.push(
          '<pre>'
          + richTextToHtmlCodeBlock((block as any)?.code?.rich_text, (block as any)?.code?.language)
          + '</pre>'
        )

        break
      case NOTION_BLOCK_TYPES.divider:
        result.push(
          '<hr />'
        )

        break
      default:
        throw new Error(`Unknown block type: ${block.type}`)
    }

  }

  return _.trim(result.join('\n'))
}



var aa = [
  {
    "object": "block",
    "id": "49da2a41-a8a3-47c5-95da-310f47c1fa90",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "ddd",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "ddd",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "db0820c1-e898-467f-a34d-9f862e751cfa",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-02-07T16:43:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "image",
    "image": {
      "caption": [
        {
          "type": "text",
          "text": {
            "content": "первая картинка",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "первая картинка",
          "href": null
        }
      ],
      "type": "file",
      "file": {
        "url": "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5b413bf6-3461-4be1-95fd-209f64b55700/IMG_20220818_141003.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230209T070626Z&X-Amz-Expires=3600&X-Amz-Signature=fcc2344521a6948a36b8e38b432d26e6d33f83a3325fb3da94fee8633c6eb055&X-Amz-SignedHeaders=host&x-id=GetObject",
        "expiry_time": "2023-02-09T08:06:26.668Z"
      }
    }
  },
  {
    "object": "block",
    "id": "4f5c310b-e17a-42f5-b8ea-013ccded3593",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "b81d8d74-5ddd-438c-8f18-400cc072ab31",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "абзац1",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "абзац1",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "1e39e8e3-9048-4301-b116-a2a46be83f58",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "строка1. _ ~ - (gggg) [bbbb]\nстрока2",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "строка1. _ ~ - (gggg) [bbbb]\nстрока2",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "3bb38812-0a52-452e-8b6f-65ff07cfe3fd",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "96b88464-2858-4ac0-a291-767524656f98",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "абзац с большим оступом",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "абзац с большим оступом",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "2ce0ad72-3b27-4127-9913-fd7e4b50e0d8",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-02-09T07:05:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": true,
    "archived": false,
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "эл1",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "эл1",
          "href": null
        }
      ],
      "color": "default"
    },
    "children": [
      {
        "object": "block",
        "id": "da29c4b0-e2ad-469e-8fc5-3afb800760b2",
        "parent": {
          "type": "block_id",
          "block_id": "2ce0ad72-3b27-4127-9913-fd7e4b50e0d8"
        },
        "created_time": "2023-01-29T09:11:00.000Z",
        "last_edited_time": "2023-02-09T07:05:00.000Z",
        "created_by": {
          "object": "user",
          "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
        },
        "last_edited_by": {
          "object": "user",
          "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "вложенный 1",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "вложенный 1",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "be022c78-d0ba-438b-a4fe-51e411c2b6d8",
        "parent": {
          "type": "block_id",
          "block_id": "2ce0ad72-3b27-4127-9913-fd7e4b50e0d8"
        },
        "created_time": "2023-02-09T07:05:00.000Z",
        "last_edited_time": "2023-02-09T07:05:00.000Z",
        "created_by": {
          "object": "user",
          "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
        },
        "last_edited_by": {
          "object": "user",
          "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "вложенный 2",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "вложенный 2",
              "href": null
            }
          ],
          "color": "default"
        }
      }
    ]
  },
  {
    "object": "block",
    "id": "c5d182b6-a37a-4cfc-8aeb-cdc0d78ec1ae",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "эл2",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "эл2",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "02bfb220-6e79-4e4b-a092-269687bdd769",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "heading_2",
    "heading_2": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "заголовок 2у",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "заголовок 2у",
          "href": null
        }
      ],
      "is_toggleable": false,
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "4828e206-d5a1-44d8-8623-b13a778f1538",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "нумерованный",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "нумерованный",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "ed2a1db4-af41-4c39-8e02-b3cf35a6e038",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "список",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "список",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "cde3c756-2c03-473d-b055-37e6549cfdd9",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "heading_3",
    "heading_3": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "Заголовок 3у",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "Заголовок 3у",
          "href": null
        }
      ],
      "is_toggleable": false,
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "9a9360ac-a80c-42c6-9ca9-d61d2bd8fd2d",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "форматированный текст",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "форматированный текст",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": " наклонный",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": true,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " наклонный",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": " ",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " ",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": "жирный",
            "link": null
          },
          "annotations": {
            "bold": true,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "жирный",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": " ",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " ",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": "подчёркнутый",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": true,
            "code": false,
            "color": "default"
          },
          "plain_text": "подчёркнутый",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": " ",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " ",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": "перечёркнутый",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": true,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "перечёркнутый",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": " ",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " ",
          "href": null
        },
        {
          "type": "text",
          "text": {
            "content": "код",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": true,
            "color": "default"
          },
          "plain_text": "код",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "7ab9107d-5e99-4f8a-ac8e-48cdf875db0d",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "ссылка",
            "link": {
              "url": "https://duckduckgo.com/?t=ffab&q=javascript+regexp&ia=web"
            }
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "ссылка",
          "href": "https://duckduckgo.com/?t=ffab&q=javascript+regexp&ia=web"
        },
        {
          "type": "text",
          "text": {
            "content": " text",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": " text",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "969fd55b-cbb3-4cf8-a08b-80d3078aac6c",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "quote",
    "quote": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "цитата\nстр2",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "цитата\nстр2",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "fd0bf774-a6f4-4e04-8537-1eab07ef5f7d",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "ввв",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "ввв",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "3f8fd667-eb0e-45a3-839d-b0f6a8f99133",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "code",
    "code": {
      "caption": [],
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "<script>alert('work!!!')</script>",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "<script>alert('work!!!')</script>",
          "href": null
        }
      ],
      "language": "html"
    }
  },
  {
    "object": "block",
    "id": "d3799fea-128d-4788-8bd1-8b7e032db697",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "маленькая палка",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "маленькая палка",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "4fba0a35-0867-4ce3-b05c-74f88588f27e",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "—",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "—",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "09453fcb-67a7-4209-921d-e9f020e51299",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-02-07T16:43:00.000Z",
    "last_edited_time": "2023-02-07T16:43:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "image",
    "image": {
      "caption": [
        {
          "type": "text",
          "text": {
            "content": "описание картинки",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "описание картинки",
          "href": null
        }
      ],
      "type": "file",
      "file": {
        "url": "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ba632bd6-b96d-47e5-8d1a-f909cc7355f4/86ee8d22f09604992318a.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230209%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230209T070626Z&X-Amz-Expires=3600&X-Amz-Signature=af1ac32dfd899f6bc466dfbbfdf943957f40ee71e071f01cc8032c3ea5ee36a6&X-Amz-SignedHeaders=host&x-id=GetObject",
        "expiry_time": "2023-02-09T08:06:26.664Z"
      }
    }
  },
  {
    "object": "block",
    "id": "91b55f01-16c8-4835-b4d1-09f24c3e4cf7",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-02-07T16:43:00.000Z",
    "last_edited_time": "2023-02-07T16:43:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "b9815344-45f8-49a8-ad89-01958a50121d",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "большая палка",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "большая палка",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "ba9f72ac-b179-4682-b587-8b17ae2bc150",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "divider",
    "divider": {}
  },
  {
    "object": "block",
    "id": "c64d4b38-f5a1-4047-b50a-51e0ce1523d2",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "пррр",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "пррр",
          "href": null
        }
      ],
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "cecbd406-5e9a-45da-bf19-abf31486b1b7",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-01-29T09:11:00.000Z",
    "last_edited_time": "2023-01-29T09:11:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "heading_1",
    "heading_1": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "заголовок1у",
            "link": null
          },
          "annotations": {
            "bold": false,
            "italic": false,
            "strikethrough": false,
            "underline": false,
            "code": false,
            "color": "default"
          },
          "plain_text": "заголовок1у",
          "href": null
        }
      ],
      "is_toggleable": false,
      "color": "default"
    }
  },
  {
    "object": "block",
    "id": "a6e7785b-b169-4b1a-9640-10c45321cb87",
    "parent": {
      "type": "page_id",
      "page_id": "206c9370-3119-41c9-a6f1-e797d17c6aba"
    },
    "created_time": "2023-02-07T16:43:00.000Z",
    "last_edited_time": "2023-02-07T16:43:00.000Z",
    "created_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "last_edited_by": {
      "object": "user",
      "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"
    },
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [],
      "color": "default"
    }
  }
] as NotionBlocks

console.log(111, convertNotionToGenericHtml(aa))
