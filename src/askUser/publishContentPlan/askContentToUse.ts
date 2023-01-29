import moment from 'moment';
import TgChat from '../../apiTg/TgChat.js';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
  PRINT_SHORT_DATE_FORMAT
} from '../../types/constants.js';
import {PageObjectResponse, RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {addSimpleStep} from '../../helpers/helpers.js';
import {CONTENT_PROPS} from '../../types/ContentItem.js';


const CONTENT_MARKER = 'content:';


export async function askContentToUse(
  items: PageObjectResponse[],
  tgChat: TgChat,
  onDone: (item: PageObjectResponse) => void
) {
  await addSimpleStep(
    tgChat,
    () => [
      tgChat.app.i18n.menu.selectContent,
      [
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
      ]
    ],
    (queryData: string) => {
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
    }
  );
}


function makeButtonTitle(item: PageObjectResponse): string {
  const dateProp = item.properties[CONTENT_PROPS.date];
  const dateText: string = (dateProp as any).date.start;
  const shortDateText: string = moment(dateText).format(PRINT_SHORT_DATE_FORMAT);
  const gistProp = item.properties[CONTENT_PROPS.gist];
  const gistRichText: RichTextItemResponse = (gistProp as any).rich_text[0];

  return `${shortDateText} ${gistRichText.plain_text}`
}
