import TgChat from '../tgApi/TgChat';
import {makeBaseState} from '../helpers/helpers';
import BaseState from '../types/BaseState';
import {AppEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/consts';
import {ContentListItem} from '../publish/PublishMaterial';
import {PageObjectResponse} from '@notionhq/client/build/src/api-endpoints';


const CONTENT_MARKER = 'content:';


// TODO: refactor


export async function askContentToUse(
  items: ContentListItem[],
  tgChat: TgChat,
  onDone: (item: PageObjectResponse) => void
) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    // print main menu message
    state.messageId = await printInitialMessage(tgChat, items);
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData.indexOf(CONTENT_MARKER) === 0) {
            const splat = queryData.split(':');
            const itemIndex = Number(splat[1]);

            onDone(items[itemIndex].item);
          }
          else if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back()
              .catch((e) => {throw e});
          }
          else if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel()
              .catch((e) => {throw e});
          }
        },
      )),
      AppEvents.CALLBACK_QUERY,
    ]);
  });
}

async function printInitialMessage(tgChat: TgChat, items: ContentListItem[]): Promise<number> {
  // TODO: что спрашивать ?????
  return tgChat.reply(tgChat.app.i18n.menu.selectChannel, [
      ...items.map((item, index) => {
      return [{
        text: item.title,
        callback_data: CONTENT_MARKER + index,
      }];
    }),
    [
      BACK_BTN,
      CANCEL_BTN,
    ],
  ]);
}
