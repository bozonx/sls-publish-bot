import {fromHtml} from 'hast-util-from-html';
import {ElementContent} from 'hast';


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


/**
 * It converts to Notion rich text. It means only inline
 */
export function convertHtmlToNotionRichText(htmlText: string): RichTextItemRequest[] {
  const tree = fromHtml(htmlText, {
    fragment: true
  })
  const result: RichTextItemRequest[] = []

  for (const child of tree.children) {
    if (child.type === 'text') {
      result.push(    {
        type: 'text',
        text: {
          content: child.value,
        },
      })
    }
    else if (child.type === 'element') {
      const [content, annotations, url] = makeItemContent(child)

      result.push({
        type: 'text',
        text: {
          content,
          link: (url) ? { url } : undefined,
        },
        annotations,
      })
    }
    // skip unknown
  }

  return result
}


function makeItemContent(item: ElementContent): [string, RichTextItemRequest['annotations'], string?] {
  let content = ''
  let url: string | undefined
  let annotations: RichTextItemRequest['annotations'] = {}

  if (item.type === 'text') {
    content += item.value
  }
  else if (item.type === 'element') {
    if (item.tagName === 'a') {
      url = item?.properties?.href as string || undefined
    }
    else if (['b', 'strong'].includes(item.tagName)) {
      annotations.bold = true
    }
    else if (['i', 'em'].includes(item.tagName)) {
      annotations.italic = true
    }
    else if (['s'].includes(item.tagName)) {
      annotations.strikethrough = true
    }
    else if (['u'].includes(item.tagName)) {
      annotations.underline = true
    }
    else if (['code'].includes(item.tagName)) {
      annotations.code = true
    }

    for (const child of item.children) {
      if (child.type === 'text') {
        content += child.value
      }
      else if (child.type === 'element') {
        const childContent = makeItemContent(child)

        content += childContent[0]
        url = childContent[2]
        annotations = {
          ...annotations,
          ...childContent[1]
        }
      }
    }
  }

  return [content, annotations, url]
}


// const test1 = `norm <b>bb gg <i>ii</i></b> <a href="https://ya.ru">aaa</a> <s>sss</s> <u>uuu</u>`
// const testmd1 = 'norm **bb _ii_** [link](https://ya.ru) --ss-- __uu__'
//
// console.log(111, convertHtmlToNotionRichText(
//   test1
// ))
