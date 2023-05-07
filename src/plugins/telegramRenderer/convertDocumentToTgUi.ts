import {TgReplyButton} from '../../types/TgReplyButton.js';
import {Document} from '../../AbstractUi/Document.js';


export function convertDocumentToTgUi(document: Document): [string, TgReplyButton[][]] {
  // TODO: support of line groups
  const messageHtml: string = 'fff'
  const buttons: TgReplyButton[][] = []

  for (const element of document.elements) {

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
