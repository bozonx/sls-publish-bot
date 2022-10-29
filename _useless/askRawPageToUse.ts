import TgChat from '../src/tgApi/TgChat';
import {makeBaseState} from '../src/helpers/helpers';
import BaseState from '../src/types/BaseState';
import {
  AppEvents,
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK,
} from '../src/types/consts';
import NotionListItem from '../src/notionApi/types/NotionListItem';


const EVENT_MARKER = 'selectedPage:';


export async function askRawPageToUse(channelId: number, tgChat: TgChat, onDone: (selectedItem: NotionListItem) => void) {
  await tgChat.addOrdinaryStep(makeBaseState(), async (state: BaseState) => {
    const rawPages = await tgChat.app.notionRequest.getDbList(
      tgChat.app.config.channels[channelId].notionRawPagesDbId
    );
    // print main menu message
    state.messageId = await printInitialMessage(channelId, rawPages, tgChat);
    // listen to result
    state.handlerIndex = tgChat.events.addListener(AppEvents.CALLBACK_QUERY, (queryData: string) => {
      if (queryData === BACK_BTN_CALLBACK) {
        return tgChat.steps.back()
          .catch((e) => {throw e});
      }
      else if (queryData === CANCEL_BTN_CALLBACK) {
        return tgChat.steps.cancel()
          .catch((e) => {throw e});
      }
      else if (queryData.indexOf(EVENT_MARKER) !== 0) {
        return;
      }

      finish(queryData, rawPages, tgChat, onDone)
        .catch((e) => {throw e});
    });
  });
}

async function printInitialMessage(channelId: number, rawPages: NotionListItem[], tgChat: TgChat): Promise<number> {
  return tgChat.reply(tgChat.app.i18n.menu.selectPage, [
    ...rawPages.map((item, index) => {
      return {
        text: item.title,
        callback_data: EVENT_MARKER + index,
      }
    }),
  ], [
    BACK_BTN,
    CANCEL_BTN,
  ]);
}

async function finish(
  queryData: string,
  rawPages: NotionListItem[],
  tgChat: TgChat,
  onDone: (selectedItem: NotionListItem) => void
) {
  const splat: string[] = queryData.split(':');
  const pageIndex = Number(splat[1])
  const selectedItem: NotionListItem = rawPages[pageIndex];

  await tgChat.reply(
    tgChat.app.i18n.menu.selectedRawPage + selectedItem.title
  );

  onDone(selectedItem);
}
