import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';
import {PageObjectResponse, RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {addSimpleStep} from '../../helpers/helpers.js';


const CONTENT_MARKER = 'content:';


export async function askContentToUse(
  items: PageObjectResponse[],
  tgChat: TgChat,
  onDone: (item: PageObjectResponse) => void
) {
  const msg = tgChat.app.i18n.menu.selectContent;
  const buttons = [
    ...items.map((item, index) => {
      return [{
        text: makeButtonTitle(item),
        callback_data: CONTENT_MARKER + index,
      }];
    }),
    [
      BACK_BTN,
      CANCEL_BTN,
    ],
  ];

  await addSimpleStep(tgChat, msg, buttons,(queryData: string) => {
    if (queryData === BACK_BTN_CALLBACK) {
      return tgChat.steps.back();
    }
    else if (queryData === CANCEL_BTN_CALLBACK) {
      return tgChat.steps.cancel();
    }
    else if (queryData.indexOf(CONTENT_MARKER) === 0) {
      const splat = queryData.split(':');
      const itemIndex = Number(splat[1]);

      onDone(items[itemIndex]);
    }
    else {
      throw new Error(`Unknown action`);
    }
  });
}


function makeButtonTitle(item: PageObjectResponse): string {
  const dateProp = item.properties['date'];
  const dateText: string = (dateProp as any).date.start;
  const shortDateText: string = moment(dateText).format('DD.MM');
  const gistProp = item.properties['gist/link'];
  const gistRichText: RichTextItemResponse = (gistProp as any).rich_text[0];

  return `${shortDateText} ${gistRichText.plain_text}`
}
