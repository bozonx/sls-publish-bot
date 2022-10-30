import {
  BlockObjectResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import {NOTION_BLOCK_TYPES, NOTION_RICH_TEXT_TYPES} from '../types/consts';


const test = [
  {
    "object": "block",
    "id": "bd6f7648-1da6-4447-9c84-42b9d1c9421b",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T09:58:00.000Z",
    "last_edited_time": "2022-10-29T11:45:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "абзац1", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "ffa2bbb0-fba7-444a-a1e3-65ccd93f8dd5",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T09:59:00.000Z",
    "last_edited_time": "2022-10-29T16:15:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "строка1. _ ~ - (gggg) [bbbb]\nстрока2", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "714eea76-d33e-46d5-994c-3484a87d7e8c",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:45:00.000Z",
    "last_edited_time": "2022-10-29T11:45:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {"rich_text": [], "color": "default"}
  }, {
    "object": "block",
    "id": "373561a5-a99d-4cc4-a675-3b1d2a504684",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:45:00.000Z",
    "last_edited_time": "2022-10-29T11:45:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "абзац с большим оступом", "link": null},
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
      }], "color": "default"
    }
  },


  //// !!!!!

  {
    "object": "block",
    "id": "7daf66d5-6968-4354-8203-b17872393c18",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:45:00.000Z",
    "last_edited_time": "2022-10-29T18:03:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": true,
    "archived": false,
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "эл1", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "f66450ba-2140-4fd9-8f84-500c330f2644",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:46:00.000Z",
    "last_edited_time": "2022-10-29T13:21:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "bulleted_list_item",
    "bulleted_list_item": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "эл2", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "2c906342-8a70-4f33-a121-8ff207f56202",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:46:00.000Z",
    "last_edited_time": "2022-10-29T11:46:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "heading_2",
    "heading_2": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "заголовок 2у", "link": null},
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
      }], "is_toggleable": false, "color": "default"
    }
  },


  ///// NNNNNNNNN

  {
    "object": "block",
    "id": "e7100c40-77ac-4017-b3fc-f08f854719de",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:46:00.000Z",
    "last_edited_time": "2022-10-29T11:48:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "нумерованный", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "bfddde76-a0c9-4aa5-8260-20f3821d1dc1",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:48:00.000Z",
    "last_edited_time": "2022-10-29T11:48:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "numbered_list_item",
    "numbered_list_item": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "список", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "a3204b24-cdc3-4967-9d8a-34e84e7136c9",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:46:00.000Z",
    "last_edited_time": "2022-10-29T11:46:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "heading_3",
    "heading_3": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "Заголовок 3у", "link": null},
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
      }], "is_toggleable": false, "color": "default"
    }
  },

  ///// FFFFFFFFF
  {
    "object": "block",
    "id": "f32946ff-a290-4bb8-ae61-e2850557d98a",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:46:00.000Z",
    "last_edited_time": "2022-10-29T16:17:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "форматированный текст", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": " наклонный", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": " ", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": "жирный", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": " ", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": "подчёркнутый", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": " ", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": "перечёркнутый", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": " ", "link": null},
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
      }, {
        "type": "text",
        "text": {"content": "код", "link": null},
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
      }], "color": "default"
    }
  },

  ////// LLLLLLLLL

  {
    "object": "block",
    "id": "17c1ae56-d687-48b6-a143-9f600e7266f8",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T09:59:00.000Z",
    "last_edited_time": "2022-10-29T14:27:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "ссылка", "link": {"url": "https://duckduckgo.com/?t=ffab&q=javascript+regexp&ia=web"}},
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
      }], "color": "default"
    }
  },

  ///////// QQQQQQQ
  {
    "object": "block",
    "id": "15da04fd-6eb7-45dc-aae3-cd7e2976e006",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:47:00.000Z",
    "last_edited_time": "2022-10-29T11:48:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "quote",
    "quote": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "цитата\nстр2", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "64c3a46a-2888-4404-bb37-d94287fcf0e8",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:48:00.000Z",
    "last_edited_time": "2022-10-29T11:48:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "ввв", "link": null},
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
      }], "color": "default"
    }
  },



  /////// CODE

  {
    "object": "block",
    "id": "e9a52c2b-832b-45e9-a651-c393d4ee8a29",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:48:00.000Z",
    "last_edited_time": "2022-10-29T11:49:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "code",
    "code": {
      "caption": [],
      "rich_text": [{
        "type": "text",
        "text": {"content": "большой код", "link": null},
        "annotations": {
          "bold": false,
          "italic": false,
          "strikethrough": false,
          "underline": false,
          "code": false,
          "color": "default"
        },
        "plain_text": "большой код",
        "href": null
      }],
      "language": "javascript"
    }
  }, {
    "object": "block",
    "id": "ab59ba9f-345c-4bdc-a2e5-b4fe92410fdb",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:49:00.000Z",
    "last_edited_time": "2022-10-29T11:49:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "маленькая палка", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "d7514a62-2696-4b82-8ae4-53c298b85d55",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:49:00.000Z",
    "last_edited_time": "2022-10-29T11:49:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "—", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "e1fdb3ae-f4f2-4294-88a0-20dcf9ea86d0",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:49:00.000Z",
    "last_edited_time": "2022-10-29T11:49:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "большая палка", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "62bb3a18-f540-44b0-b009-27f2df91d2d8",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:49:00.000Z",
    "last_edited_time": "2022-10-29T11:49:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "divider",
    "divider": {}
  }, {
    "object": "block",
    "id": "2f1cb786-a0c5-4c47-b33f-30ca77ab3693",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T11:49:00.000Z",
    "last_edited_time": "2022-10-29T11:49:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {
      "rich_text": [{
        "type": "text",
        "text": {"content": "пррр", "link": null},
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
      }], "color": "default"
    }
  }, {
    "object": "block",
    "id": "66dac84a-6b1a-4570-b7aa-b57f83cc1b15",
    "parent": {"type": "page_id", "page_id": "2465ac4b-72d5-4032-927d-5664bb2ee592"},
    "created_time": "2022-10-29T16:17:00.000Z",
    "last_edited_time": "2022-10-29T16:17:00.000Z",
    "created_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "last_edited_by": {"object": "user", "id": "dd4d9b08-24f5-4a24-9b36-19a42b496f44"},
    "has_children": false,
    "archived": false,
    "type": "paragraph",
    "paragraph": {"rich_text": [], "color": "default"}
  }
];


export function transformNotionToTelegraph(notionBlocks: BlockObjectResponse[]) {
  let result = '';
  let numberListCounter = 0;
  let bulletedListCounter = 0;

  for (const block of notionBlocks) {
    if (block.has_children) {
      // TODO: recurse
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      // if the end of ol block
      if (numberListCounter > 0) {
        result += '\n';
      }

      numberListCounter = 0;
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      // if the end of ul block
      if (bulletedListCounter > 0) {
        result += '\n';
      }

      bulletedListCounter = 0;
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result += '# ' + richTextToSimpleTextList((block as any)?.heading_1?.rich_text) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.heading_2:
        result += '## ' + richTextToSimpleTextList((block as any)?.heading_2?.rich_text) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.heading_3:
        result += '### ' + richTextToSimpleTextList((block as any)?.heading_3?.rich_text) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result += parseRichTextList((block as any)?.paragraph?.rich_text) + '\n\n';
        }
        else {
          result += '\n';
        }

        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        bulletedListCounter++;
        result += `- ` + parseRichTextList((block as any)?.bulleted_list_item?.rich_text) + '\n';

        break;
      case NOTION_BLOCK_TYPES.numbered_list_item:
        numberListCounter++;
        result += `${numberListCounter}. ` + parseRichTextList((block as any)?.numbered_list_item?.rich_text) + '\n';

        break;
      case NOTION_BLOCK_TYPES.quote:
        result += `> ` + parseRichTextList((block as any)?.quote?.rich_text).replace(/\n/g, '\n> ') + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.code:
        // TODO: проверить требования по экранированию
        result += '\n' + format.monospaceBlock(richTextToSimpleTextList((block as any)?.code?.rich_text), (block as any)?.code?.language) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.divider:
        result += '---\n\n';

        break;
      default:
        // TODO: ругаться
        break;
    }
  }

  return _.trim(result);
}


function parseRichTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  let result = '';

  for (const item of richText) {
    result += parseRichText(item)
  }

  return result;
}

function richTextToSimpleTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';
  let result = '';

  for (const item of richText) {
    result += item.plain_text
  }

  return result;
}

function parseRichText(rtItem: TextRichTextItemResponse): string {
  switch (rtItem.type) {
    case NOTION_RICH_TEXT_TYPES.text:
      return toMarkDown(rtItem.text.content, rtItem.annotations, rtItem.href);
    default:
      return rtItem.plain_text;
  }
}

function toMarkDown(text: string, annotations: Record<string, any>, link?: string | null): string {
  let preparedText = format.escape(text);

  if (link) {
    preparedText = format.url(preparedText, link);
  }

  // TODO: а если несколько сразу ???

  if (annotations.bold) {
    return format.bold(preparedText);
  }
  else if (annotations.italic) {
    return format.italic(preparedText);
  }
  else if (annotations.strikethrough) {
    return format.strikethrough(preparedText);
  }
  else if (annotations.underline) {
    return format.underline(preparedText);
  }
  else if (annotations.code) {
    return format.monospace(preparedText);
  }
  else {
    // no formatting
    return preparedText;
  }
}
