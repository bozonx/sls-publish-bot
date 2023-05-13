import {TgReplyButton} from '../../../src/types/TgReplyButton.js';
import {Document} from '../../../../squidlet-ui-builder/src/AbstractUi/Document.js';


export function convertDocumentToTgUi(document: Document): [string, TgReplyButton[][]] {
  // TODO: support of line groups
  const messageHtml: string = 'fff'
  const buttons: TgReplyButton[][] = []

  for (const element of document.elements) {
    const type: string = (element as any)?.type

    if (type === 'Button') {
      buttons.push([{
        text: (element as any).text,
        // TODO: сгенерировать путь до элемента по именам
        callback_data: (element as any).name,
      }])
    }
  }

  return [messageHtml, buttons]
}


// export function convertMenuBtnsToTgInlineBtns(menu: DynamicMenuButton[]): TgReplyButton[][] {
//   return menu.map((item) => {
//     return [
//       {
//         text: item.label,
//         // TODO: наперное полный путь + name
//         callback_data: '!!!!',
//       }
//     ]
//   })
// }
