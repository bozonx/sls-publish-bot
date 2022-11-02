import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';
import {PageObjectResponse, RichTextItemResponse} from '@notionhq/client/build/src/api-endpoints';
import moment from 'moment';


const CONTENT_MARKER = 'content:';


export async function askContentToUse(
  items: PageObjectResponse[],
  tgChat: TgChat,
  onDone: (item: PageObjectResponse) => void
) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(tgChat, items));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
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
        },
      )),
      AppEvents.CALLBACK_QUERY,
    ]);
  });
}

async function printInitialMessage(tgChat: TgChat, items: PageObjectResponse[]): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectContent, [
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
  ]);
}


function makeButtonTitle(item: PageObjectResponse): string {
  const dateProp = item.properties['date'];
  const dateText: string = (dateProp as any).date.start;
  const shortDateText: string = moment(dateText).format('DD.MM');
  const gistProp = item.properties['gist/link'];
  const gistRichText: RichTextItemResponse = (gistProp as any).rich_text[0];

  return `${shortDateText} ${gistRichText.plain_text}`
}
